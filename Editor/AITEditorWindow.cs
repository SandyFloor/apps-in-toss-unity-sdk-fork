using UnityEngine;
using UnityEditor;
using static AppsInToss.AITConvertCore;

namespace AppsInToss
{
    public class AITEditorWin : EditorWindow
    {
        [MenuItem("Apps in Toss / 미니앱 변환", false, 1)]
        public static void Open()
        {
            var win = GetWindow(typeof(AITEditorWin), false, "Apps in Toss 미니앱 변환 도구");
            win.minSize = new Vector2(400, 500);
            win.position = new Rect(100, 100, 650, 800);
            win.Show();
        }

        // 향후 호환성을 위해 AITConvertCore 사용
        public static AITExportError DoExport(bool buildWebGL = true)
        {
            return AITConvertCore.DoExport(buildWebGL);
        }

        public void OnFocus()
        {
            AITSettingsHelperInterface.helper.OnFocus();
        }

        public void OnLostFocus()
        {
            AITSettingsHelperInterface.helper.OnLostFocus();
        }

        public void OnDisable()
        {
            AITSettingsHelperInterface.helper.OnDisable();
        }

        public void OnGUI()
        {
            AITSettingsHelperInterface.helper.OnSettingsGUI(this);
            AITSettingsHelperInterface.helper.OnBuildButtonGUI(this);
        }
    }
}