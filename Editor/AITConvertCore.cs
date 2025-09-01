using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEngine;
using UnityEngine.Rendering;
using LitJson;
using UnityEditor.Build;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Runtime.InteropServices;

namespace AppsInToss
{
    public class AITConvertCore
    {
        static AITConvertCore()
        {
            
        }

        public static void Init()
        {
            string templateHeader = "PROJECT:";
            
            // Apps in Toss 플랫폼에 맞는 WebGL 설정
            PlayerSettings.WebGL.threadsSupport = false;
            PlayerSettings.runInBackground = false;
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
            
#if UNITY_2022_3_OR_NEWER
            PlayerSettings.WebGL.template = $"{templateHeader}AITTemplate2022";
#elif UNITY_2020_1_OR_NEWER
            PlayerSettings.WebGL.template = $"{templateHeader}AITTemplate2020";
#else
            PlayerSettings.WebGL.template = $"{templateHeader}AITTemplate";
#endif
            
            PlayerSettings.WebGL.linkerTarget = WebGLLinkerTarget.Wasm;
            PlayerSettings.WebGL.dataCaching = false;
            
#if UNITY_2021_2_OR_NEWER
            PlayerSettings.WebGL.debugSymbolMode = WebGLDebugSymbolMode.External;
#else
            PlayerSettings.WebGL.debugSymbols = true;
#endif

            // Apps in Toss 플랫폼 특화 설정
            PlayerSettings.companyName = "Apps in Toss";
            PlayerSettings.defaultCursor = null;
            PlayerSettings.cursorHotspot = Vector2.zero;
        }

        public enum AITExportError
        {
            SUCCEED = 0,
            NODE_NOT_FOUND = 1,
            BUILD_WEBGL_FAILED = 2,
            INVALID_APP_CONFIG = 3,
            NETWORK_ERROR = 4,
        }

        public static AITEditorScriptObject config => UnityUtil.GetEditorConf();
        
        public static string defaultTemplateDir => "appsintoss-default";
        public static string webglDir = "webgl"; // 导出的webgl目录
        public static string miniGameDir = "miniapp"; // 生成미니앱的目录
        public static string audioDir = "Assets"; // 음频资源目录
        public static string frameworkDir = "framework";
        public static string dataFileSize = string.Empty;
        public static string codeMd5 = string.Empty;
        public static string dataMd5 = string.Empty;
        public static string defaultImgSrc = "Assets/AppsInToss-SDK/Runtime/appsintoss-default/images/background.jpg";

        private static bool lastBrotliType = false;
        
        public static bool UseIL2CPP
        {
            get
            {
                return PlayerSettings.GetScriptingBackend(BuildTargetGroup.WebGL) == ScriptingImplementation.IL2CPP;
            }
        }

        /// <summary>
        /// Apps in Toss 미니앱으로 변환 실행
        /// </summary>
        /// <param name="buildWebGL">WebGL 빌드 실행 여부</param>
        /// <returns>변환 결과</returns>
        public static AITExportError DoExport(bool buildWebGL = true)
        {
            Init();
            
            Debug.Log("Apps in Toss 미니앱 변환을 시작합니다...");
            
            var config = UnityUtil.GetEditorConf();
            if (config == null)
            {
                Debug.LogError("Apps in Toss 설정을 찾을 수 없습니다.");
                return AITExportError.INVALID_APP_CONFIG;
            }

            try
            {
                if (buildWebGL)
                {
                    var webglResult = BuildWebGL();
                    if (webglResult != AITExportError.SUCCEED)
                    {
                        return webglResult;
                    }
                }

                // Apps in Toss 미니앱 패키지 생성
                var exportResult = GenerateMiniAppPackage();
                if (exportResult != AITExportError.SUCCEED)
                {
                    return exportResult;
                }

                Debug.Log("Apps in Toss 미니앱 변환이 완료되었습니다!");
                return AITExportError.SUCCEED;
            }
            catch (Exception e)
            {
                Debug.LogError($"변환 중 오류가 발생했습니다: {e.Message}");
                return AITExportError.BUILD_WEBGL_FAILED;
            }
        }

        private static AITExportError BuildWebGL()
        {
            Debug.Log("WebGL 빌드를 시작합니다...");
            
            string[] scenes = UnityUtil.GetBuildScenes();
            string outputPath = Path.Combine(UnityUtil.GetProjectPath(), webglDir);
            
            // 기존 WebGL 빌드 폴더 정리
            if (Directory.Exists(outputPath))
            {
                Directory.Delete(outputPath, true);
            }

            BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
            {
                scenes = scenes,
                locationPathName = outputPath,
                target = BuildTarget.WebGL,
                options = BuildOptions.None
            };

            var result = BuildPipeline.BuildPlayer(buildPlayerOptions);
            
            if (result.summary.result != UnityEditor.Build.Reporting.BuildResult.Succeeded)
            {
                Debug.LogError("WebGL 빌드가 실패했습니다.");
                return AITExportError.BUILD_WEBGL_FAILED;
            }

            Debug.Log("WebGL 빌드가 완료되었습니다.");
            return AITExportError.SUCCEED;
        }

        private static AITExportError GenerateMiniAppPackage()
        {
            Debug.Log("Apps in Toss 미니앱 패키지를 생성합니다...");
            
            string projectPath = UnityUtil.GetProjectPath();
            string webglPath = Path.Combine(projectPath, webglDir);
            string outputPath = Path.Combine(projectPath, miniGameDir);
            
            if (!Directory.Exists(webglPath))
            {
                Debug.LogError("WebGL 빌드 결과를 찾을 수 없습니다. WebGL 빌드를 먼저 실행하세요.");
                return AITExportError.BUILD_WEBGL_FAILED;
            }

            // 기존 미니앱 폴더 정리
            if (Directory.Exists(outputPath))
            {
                Directory.Delete(outputPath, true);
            }
            Directory.CreateDirectory(outputPath);

            // Apps in Toss 템플릿 복사
            string templatePath = GetTemplatePath();
            UnityUtil.CopyDirectory(templatePath, outputPath);
            
            // WebGL 빌드 결과 복사 및 처리
            ProcessWebGLBuild(webglPath, outputPath);
            
            // Apps in Toss 설정 적용
            ApplyAppsInTossConfiguration(outputPath);
            
            Debug.Log($"Apps in Toss 미니앱이 생성되었습니다: {outputPath}");
            return AITExportError.SUCCEED;
        }

        private static string GetTemplatePath()
        {
            // Apps in Toss 템플릿 경로 반환
            string packagePath = "Packages/com.appsintoss.miniapp/Runtime/appsintoss-default";
            return Path.GetFullPath(packagePath);
        }

        private static void ProcessWebGLBuild(string webglPath, string outputPath)
        {
            // WebGL 빌드 결과를 Apps in Toss 미니앱 형식에 맞게 처리
            string buildPath = Path.Combine(webglPath, "Build");
            string targetPath = Path.Combine(outputPath, "game");
            
            if (Directory.Exists(buildPath))
            {
                UnityUtil.CopyDirectory(buildPath, targetPath);
            }

            // 기타 필요한 파일들 복사
            string[] webglFiles = { "TemplateData", "index.html" };
            foreach (string file in webglFiles)
            {
                string srcPath = Path.Combine(webglPath, file);
                string destPath = Path.Combine(outputPath, file);
                
                if (Directory.Exists(srcPath))
                {
                    UnityUtil.CopyDirectory(srcPath, destPath);
                }
                else if (File.Exists(srcPath))
                {
                    File.Copy(srcPath, destPath, true);
                }
            }
        }

        private static void ApplyAppsInTossConfiguration(string outputPath)
        {
            var config = UnityUtil.GetEditorConf();
            
            // app.json 생성
            var appConfig = new
            {
                appId = config.appId,
                appName = config.appName,
                version = config.version,
                description = config.description,
                pages = new[] { "pages/index/index" },
                window = new
                {
                    navigationBarTitleText = config.appName,
                    backgroundColor = "#ffffff"
                },
                permissions = config.permissions,
                plugins = config.plugins
            };

            string appConfigJson = JsonMapper.ToJson(appConfig);
            File.WriteAllText(Path.Combine(outputPath, "app.json"), appConfigJson, Encoding.UTF8);
            
            // 기타 Apps in Toss 특화 설정 적용
            ApplyPlatformSpecificSettings(outputPath, config);
        }

        private static void ApplyPlatformSpecificSettings(string outputPath, AITEditorScriptObject config)
        {
            // Apps in Toss 플랫폼 특화 설정 적용
            // 토스페이 설정, 광고 설정, 분석 설정 등
            
            if (!string.IsNullOrEmpty(config.tossPayMerchantId))
            {
                var paymentConfig = new
                {
                    merchantId = config.tossPayMerchantId,
                    clientKey = config.tossPayClientKey,
                    environment = config.isProduction ? "production" : "sandbox"
                };
                
                string paymentConfigJson = JsonMapper.ToJson(paymentConfig);
                File.WriteAllText(Path.Combine(outputPath, "payment-config.json"), paymentConfigJson, Encoding.UTF8);
            }

            if (config.enableAdvertisement)
            {
                var adConfig = new
                {
                    enabled = true,
                    bannerId = config.bannerAdId,
                    interstitialId = config.interstitialAdId,
                    rewardedId = config.rewardedAdId
                };
                
                string adConfigJson = JsonMapper.ToJson(adConfig);
                File.WriteAllText(Path.Combine(outputPath, "ad-config.json"), adConfigJson, Encoding.UTF8);
            }
        }
    }

    /// <summary>
    /// Apps in Toss Editor 설정 오브젝트
    /// </summary>
    [System.Serializable]
    public class AITEditorScriptObject : ScriptableObject
    {
        [Header("앱 기본 정보")]
        public string appId = "";
        public string appName = "My Apps in Toss Game";
        public string version = "1.0.0";
        public string description = "Apps in Toss 미니앱 게임";
        
        [Header("빌드 설정")]
        public bool isProduction = false;
        public bool enableOptimization = true;
        public bool enableCompression = false;
        
        [Header("토스페이 설정")]
        public string tossPayMerchantId = "";
        public string tossPayClientKey = "";
        
        [Header("광고 설정")]
        public bool enableAdvertisement = false;
        public string bannerAdId = "";
        public string interstitialAdId = "";
        public string rewardedAdId = "";
        
        [Header("권한 설정")]
        public string[] permissions = new string[] { "userInfo", "location", "camera" };
        
        [Header("플러그인 설정")]
        public string[] plugins = new string[] { };
    }

    /// <summary>
    /// 유틸리티 클래스
    /// </summary>
    public static class UnityUtil
    {
        public static string GetProjectPath()
        {
            return Directory.GetParent(Application.dataPath).FullName;
        }

        public static string[] GetBuildScenes()
        {
            var scenes = new List<string>();
            foreach (var scene in EditorBuildSettings.scenes)
            {
                if (scene.enabled)
                {
                    scenes.Add(scene.path);
                }
            }
            return scenes.ToArray();
        }

        public static AITEditorScriptObject GetEditorConf()
        {
            string configPath = "Assets/AppsInToss/Editor/AITConfig.asset";
            var config = AssetDatabase.LoadAssetAtPath<AITEditorScriptObject>(configPath);
            
            if (config == null)
            {
                // 기본 설정 생성
                config = ScriptableObject.CreateInstance<AITEditorScriptObject>();
                
                string directory = Path.GetDirectoryName(configPath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                
                AssetDatabase.CreateAsset(config, configPath);
                AssetDatabase.SaveAssets();
            }
            
            return config;
        }

        public static void CopyDirectory(string sourceDir, string targetDir)
        {
            Directory.CreateDirectory(targetDir);
            
            foreach (var file in Directory.GetFiles(sourceDir))
            {
                string targetFile = Path.Combine(targetDir, Path.GetFileName(file));
                File.Copy(file, targetFile, true);
            }
            
            foreach (var dir in Directory.GetDirectories(sourceDir))
            {
                string targetSubDir = Path.Combine(targetDir, Path.GetFileName(dir));
                CopyDirectory(dir, targetSubDir);
            }
        }
    }

    /// <summary>
    /// Settings Helper Interface for Apps in Toss
    /// </summary>
    public static class AITSettingsHelperInterface
    {
        public static IAITSettingsHelper helper = new AITSettingsHelper();
    }

    public interface IAITSettingsHelper
    {
        void OnFocus();
        void OnLostFocus();
        void OnDisable();
        void OnSettingsGUI(EditorWindow window);
        void OnBuildButtonGUI(EditorWindow window);
    }

    public class AITSettingsHelper : IAITSettingsHelper
    {
        private Vector2 scrollPosition;
        private AITEditorScriptObject config;

        public void OnFocus()
        {
            config = UnityUtil.GetEditorConf();
        }

        public void OnLostFocus()
        {
            if (config != null)
            {
                EditorUtility.SetDirty(config);
                AssetDatabase.SaveAssets();
            }
        }

        public void OnDisable()
        {
            OnLostFocus();
        }

        public void OnSettingsGUI(EditorWindow window)
        {
            if (config == null)
                config = UnityUtil.GetEditorConf();

            scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
            
            GUILayout.Space(10);
            GUILayout.Label("Apps in Toss 미니앱 설정", EditorStyles.boldLabel);
            GUILayout.Space(10);
            
            // 앱 기본 정보
            GUILayout.Label("앱 기본 정보", EditorStyles.boldLabel);
            config.appId = EditorGUILayout.TextField("앱 ID", config.appId);
            config.appName = EditorGUILayout.TextField("앱 이름", config.appName);
            config.version = EditorGUILayout.TextField("버전", config.version);
            config.description = EditorGUILayout.TextArea(config.description, GUILayout.Height(60));
            
            GUILayout.Space(10);
            
            // 빌드 설정
            GUILayout.Label("빌드 설정", EditorStyles.boldLabel);
            config.isProduction = EditorGUILayout.Toggle("프로덕션 모드", config.isProduction);
            config.enableOptimization = EditorGUILayout.Toggle("최적화 활성화", config.enableOptimization);
            config.enableCompression = EditorGUILayout.Toggle("압축 활성화", config.enableCompression);
            
            GUILayout.Space(10);
            
            // 토스페이 설정
            GUILayout.Label("토스페이 설정", EditorStyles.boldLabel);
            config.tossPayMerchantId = EditorGUILayout.TextField("가맹점 ID", config.tossPayMerchantId);
            config.tossPayClientKey = EditorGUILayout.TextField("클라이언트 키", config.tossPayClientKey);
            
            GUILayout.Space(10);
            
            // 광고 설정
            GUILayout.Label("광고 설정", EditorStyles.boldLabel);
            config.enableAdvertisement = EditorGUILayout.Toggle("광고 활성화", config.enableAdvertisement);
            if (config.enableAdvertisement)
            {
                config.bannerAdId = EditorGUILayout.TextField("배너 광고 ID", config.bannerAdId);
                config.interstitialAdId = EditorGUILayout.TextField("전면 광고 ID", config.interstitialAdId);
                config.rewardedAdId = EditorGUILayout.TextField("보상형 광고 ID", config.rewardedAdId);
            }
            
            EditorGUILayout.EndScrollView();
            
            if (GUI.changed)
            {
                EditorUtility.SetDirty(config);
            }
        }

        public void OnBuildButtonGUI(EditorWindow window)
        {
            GUILayout.Space(20);
            GUILayout.Label("빌드", EditorStyles.boldLabel);
            
            if (GUILayout.Button("미니앱으로 변환", GUILayout.Height(40)))
            {
                var result = AITConvertCore.DoExport(true);
                if (result == AITConvertCore.AITExportError.SUCCEED)
                {
                    EditorUtility.DisplayDialog("성공", "Apps in Toss 미니앱 변환이 완료되었습니다!", "확인");
                }
                else
                {
                    EditorUtility.DisplayDialog("실패", $"변환 중 오류가 발생했습니다: {result}", "확인");
                }
            }
            
            if (GUILayout.Button("WebGL 빌드만 실행"))
            {
                var result = AITConvertCore.DoExport(false);
                if (result == AITConvertCore.AITExportError.SUCCEED)
                {
                    EditorUtility.DisplayDialog("성공", "WebGL 빌드가 완료되었습니다!", "확인");
                }
                else
                {
                    EditorUtility.DisplayDialog("실패", $"빌드 중 오류가 발생했습니다: {result}", "확인");
                }
            }
            
            GUILayout.Space(10);
            
            if (GUILayout.Button("설정 초기화"))
            {
                if (EditorUtility.DisplayDialog("설정 초기화", "모든 설정을 초기화하시겠습니까?", "예", "아니오"))
                {
                    string configPath = "Assets/AppsInToss/Editor/AITConfig.asset";
                    AssetDatabase.DeleteAsset(configPath);
                    config = UnityUtil.GetEditorConf();
                }
            }
        }
    }
}