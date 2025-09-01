#if UNITY_WEBGL || APPSINTOSS_MINIAPP || UNITY_EDITOR
using System;
using System.Collections.Generic;

namespace AppsInToss
{
    /// <summary>
    /// Apps in Toss SDK 메인 API 클래스
    /// Unity에서 Apps in Toss 미니앱 플랫폼의 모든 기능에 접근할 수 있는 통합 인터페이스
    /// </summary>
    public class AIT : AITBase
    {
        /// <summary>
        /// Apps in Toss SDK 초기화
        /// 앱 시작 시 반드시 호출해야 합니다.
        /// </summary>
        /// <param name="callback">초기화 완료 콜백</param>
        public static void Init(Action<InitResult> callback = null)
        {
            AITSDKManagerHandler.Instance.Init(callback);
        }

        /// <summary>
        /// 로그인 상태 확인
        /// </summary>
        /// <param name="callback">결과 콜백</param>
        public static void CheckLoginStatus(Action<LoginStatusResult> callback = null)
        {
            AITSDKManagerHandler.Instance.CheckLoginStatus(callback);
        }

        /// <summary>
        /// 사용자 로그인 (토스 계정)
        /// </summary>
        /// <param name="options">로그인 옵션</param>
        public static void Login(LoginOptions options)
        {
            AITSDKManagerHandler.Instance.Login(options);
        }

        /// <summary>
        /// 사용자 로그아웃
        /// </summary>
        /// <param name="callback">로그아웃 완료 콜백</param>
        public static void Logout(Action<BaseResult> callback = null)
        {
            AITSDKManagerHandler.Instance.Logout(callback);
        }

        /// <summary>
        /// 사용자 정보 조회
        /// </summary>
        /// <param name="callback">사용자 정보 콜백</param>
        public static void GetUserInfo(Action<UserInfoResult> callback)
        {
            AITSDKManagerHandler.Instance.GetUserInfo(callback);
        }

        /// <summary>
        /// 결제 요청 (토스페이)
        /// </summary>
        /// <param name="options">결제 옵션</param>
        public static void RequestPayment(PaymentOptions options)
        {
            AITSDKManagerHandler.Instance.RequestPayment(options);
        }

        /// <summary>
        /// 배너 광고 표시
        /// </summary>
        /// <param name="options">광고 옵션</param>
        public static void ShowBannerAd(BannerAdOptions options)
        {
            AITSDKManagerHandler.Instance.ShowBannerAd(options);
        }

        /// <summary>
        /// 배너 광고 숨김
        /// </summary>
        public static void HideBannerAd()
        {
            AITSDKManagerHandler.Instance.HideBannerAd();
        }

        /// <summary>
        /// 전면 광고 표시
        /// </summary>
        /// <param name="options">광고 옵션</param>
        public static void ShowInterstitialAd(InterstitialAdOptions options)
        {
            AITSDKManagerHandler.Instance.ShowInterstitialAd(options);
        }

        /// <summary>
        /// 보상형 광고 표시
        /// </summary>
        /// <param name="options">광고 옵션</param>
        public static void ShowRewardedAd(RewardedAdOptions options)
        {
            AITSDKManagerHandler.Instance.ShowRewardedAd(options);
        }

        /// <summary>
        /// 데이터 저장 (로컬 스토리지)
        /// </summary>
        /// <param name="key">키</param>
        /// <param name="value">값</param>
        /// <param name="callback">저장 완료 콜백</param>
        public static void SetStorageData(string key, string value, Action<BaseResult> callback = null)
        {
            AITSDKManagerHandler.Instance.SetStorageData(key, value, callback);
        }

        /// <summary>
        /// 데이터 조회 (로컬 스토리지)
        /// </summary>
        /// <param name="key">키</param>
        /// <param name="callback">조회 결과 콜백</param>
        public static void GetStorageData(string key, Action<StorageDataResult> callback)
        {
            AITSDKManagerHandler.Instance.GetStorageData(key, callback);
        }

        /// <summary>
        /// 데이터 삭제 (로컬 스토리지)
        /// </summary>
        /// <param name="key">키</param>
        /// <param name="callback">삭제 완료 콜백</param>
        public static void RemoveStorageData(string key, Action<BaseResult> callback = null)
        {
            AITSDKManagerHandler.Instance.RemoveStorageData(key, callback);
        }

        /// <summary>
        /// 텍스트 공유
        /// </summary>
        /// <param name="options">공유 옵션</param>
        public static void ShareText(ShareTextOptions options)
        {
            AITSDKManagerHandler.Instance.ShareText(options);
        }

        /// <summary>
        /// 링크 공유
        /// </summary>
        /// <param name="options">공유 옵션</param>
        public static void ShareLink(ShareLinkOptions options)
        {
            AITSDKManagerHandler.Instance.ShareLink(options);
        }

        /// <summary>
        /// 이미지 공유
        /// </summary>
        /// <param name="options">공유 옵션</param>
        public static void ShareImage(ShareImageOptions options)
        {
            AITSDKManagerHandler.Instance.ShareImage(options);
        }

        /// <summary>
        /// 진동 재생
        /// </summary>
        /// <param name="type">진동 타입</param>
        public static void Vibrate(VibrationType type = VibrationType.Light)
        {
            AITSDKManagerHandler.Instance.Vibrate(type);
        }

        /// <summary>
        /// 토스트 메시지 표시
        /// </summary>
        /// <param name="options">토스트 옵션</param>
        public static void ShowToast(ToastOptions options)
        {
            AITSDKManagerHandler.Instance.ShowToast(options);
        }

        /// <summary>
        /// 다이얼로그 표시
        /// </summary>
        /// <param name="options">다이얼로그 옵션</param>
        public static void ShowDialog(DialogOptions options)
        {
            AITSDKManagerHandler.Instance.ShowDialog(options);
        }

        /// <summary>
        /// 네트워크 상태 조회
        /// </summary>
        /// <param name="callback">네트워크 상태 콜백</param>
        public static void GetNetworkType(Action<NetworkTypeResult> callback)
        {
            AITSDKManagerHandler.Instance.GetNetworkType(callback);
        }

        /// <summary>
        /// 기기 정보 조회
        /// </summary>
        /// <param name="callback">기기 정보 콜백</param>
        public static void GetDeviceInfo(Action<DeviceInfoResult> callback)
        {
            AITSDKManagerHandler.Instance.GetDeviceInfo(callback);
        }

        /// <summary>
        /// 위치 정보 조회 (일회성)
        /// </summary>
        /// <param name="options">위치 조회 옵션</param>
        public static void GetLocation(LocationOptions options)
        {
            AITSDKManagerHandler.Instance.GetLocation(options);
        }

        /// <summary>
        /// 카메라로 사진 촬영
        /// </summary>
        /// <param name="options">카메라 옵션</param>
        public static void TakePhoto(CameraOptions options)
        {
            AITSDKManagerHandler.Instance.TakePhoto(options);
        }

        /// <summary>
        /// 앨범에서 사진 선택
        /// </summary>
        /// <param name="options">앨범 옵션</param>
        public static void ChooseImage(ChooseImageOptions options)
        {
            AITSDKManagerHandler.Instance.ChooseImage(options);
        }

        /// <summary>
        /// 클립보드에 텍스트 복사
        /// </summary>
        /// <param name="text">복사할 텍스트</param>
        /// <param name="callback">복사 완료 콜백</param>
        public static void SetClipboardText(string text, Action<BaseResult> callback = null)
        {
            AITSDKManagerHandler.Instance.SetClipboardText(text, callback);
        }

        /// <summary>
        /// 클립보드에서 텍스트 가져오기
        /// </summary>
        /// <param name="callback">텍스트 가져오기 콜백</param>
        public static void GetClipboardText(Action<ClipboardTextResult> callback)
        {
            AITSDKManagerHandler.Instance.GetClipboardText(callback);
        }

        /// <summary>
        /// 사용자 이벤트 추적 (분석용)
        /// </summary>
        /// <param name="eventName">이벤트 이름</param>
        /// <param name="parameters">이벤트 파라미터</param>
        public static void TrackEvent(string eventName, Dictionary<string, object> parameters = null)
        {
            AITSDKManagerHandler.Instance.TrackEvent(eventName, parameters);
        }

        /// <summary>
        /// 사용자 속성 설정 (분석용)
        /// </summary>
        /// <param name="properties">사용자 속성</param>
        public static void SetUserProperties(Dictionary<string, object> properties)
        {
            AITSDKManagerHandler.Instance.SetUserProperties(properties);
        }

        /// <summary>
        /// 앱 평가 요청
        /// </summary>
        /// <param name="callback">평가 요청 결과 콜백</param>
        public static void RequestAppReview(Action<BaseResult> callback = null)
        {
            AITSDKManagerHandler.Instance.RequestAppReview(callback);
        }

        /// <summary>
        /// 외부 URL 열기
        /// </summary>
        /// <param name="url">열 URL</param>
        /// <param name="callback">결과 콜백</param>
        public static void OpenURL(string url, Action<BaseResult> callback = null)
        {
            AITSDKManagerHandler.Instance.OpenURL(url, callback);
        }

        /// <summary>
        /// 앱 버전 체크
        /// </summary>
        /// <param name="callback">버전 체크 결과 콜백</param>
        public static void CheckAppVersion(Action<AppVersionResult> callback)
        {
            AITSDKManagerHandler.Instance.CheckAppVersion(callback);
        }

        /// <summary>
        /// 푸시 알림 권한 요청
        /// </summary>
        /// <param name="callback">권한 요청 결과 콜백</param>
        public static void RequestNotificationPermission(Action<PermissionResult> callback)
        {
            AITSDKManagerHandler.Instance.RequestNotificationPermission(callback);
        }

        /// <summary>
        /// 연락처 권한 요청
        /// </summary>
        /// <param name="callback">권한 요청 결과 콜백</param>
        public static void RequestContactsPermission(Action<PermissionResult> callback)
        {
            AITSDKManagerHandler.Instance.RequestContactsPermission(callback);
        }

        /// <summary>
        /// 위치 권한 요청
        /// </summary>
        /// <param name="callback">권한 요청 결과 콜백</param>
        public static void RequestLocationPermission(Action<PermissionResult> callback)
        {
            AITSDKManagerHandler.Instance.RequestLocationPermission(callback);
        }

        /// <summary>
        /// 카메라 권한 요청
        /// </summary>
        /// <param name="callback">권한 요청 결과 콜백</param>
        public static void RequestCameraPermission(Action<PermissionResult> callback)
        {
            AITSDKManagerHandler.Instance.RequestCameraPermission(callback);
        }

        #region Audio System APIs

        /// <summary>
        /// 오디오 컨텍스트 생성
        /// </summary>
        /// <param name="options">오디오 생성 옵션</param>
        /// <returns>오디오 ID</returns>
        public static int CreateAudioContext(AudioContextOptions options)
        {
            return AITSDKManagerHandler.Instance.CreateAudioContext(options);
        }

        /// <summary>
        /// 오디오 소스 설정
        /// </summary>
        /// <param name="audioId">오디오 ID</param>
        /// <param name="src">오디오 소스 URL</param>
        public static void SetAudioSource(int audioId, string src)
        {
            AITSDKManagerHandler.Instance.SetAudioSource(audioId, src);
        }

        /// <summary>
        /// 오디오 재생
        /// </summary>
        /// <param name="audioId">오디오 ID</param>
        public static void PlayAudio(int audioId)
        {
            AITSDKManagerHandler.Instance.PlayAudio(audioId);
        }

        /// <summary>
        /// 오디오 일시정지
        /// </summary>
        /// <param name="audioId">오디오 ID</param>
        public static void PauseAudio(int audioId)
        {
            AITSDKManagerHandler.Instance.PauseAudio(audioId);
        }

        /// <summary>
        /// 오디오 정지
        /// </summary>
        /// <param name="audioId">오디오 ID</param>
        public static void StopAudio(int audioId)
        {
            AITSDKManagerHandler.Instance.StopAudio(audioId);
        }

        /// <summary>
        /// 오디오 볼륨 설정
        /// </summary>
        /// <param name="audioId">오디오 ID</param>
        /// <param name="volume">볼륨 (0.0 ~ 1.0)</param>
        public static void SetAudioVolume(int audioId, float volume)
        {
            AITSDKManagerHandler.Instance.SetAudioVolume(audioId, volume);
        }

        /// <summary>
        /// 오디오 반복 설정
        /// </summary>
        /// <param name="audioId">오디오 ID</param>
        /// <param name="loop">반복 여부</param>
        public static void SetAudioLoop(int audioId, bool loop)
        {
            AITSDKManagerHandler.Instance.SetAudioLoop(audioId, loop);
        }

        /// <summary>
        /// 오디오 컨텍스트 제거
        /// </summary>
        /// <param name="audioId">오디오 ID</param>
        public static void DestroyAudio(int audioId)
        {
            AITSDKManagerHandler.Instance.DestroyAudio(audioId);
        }

        /// <summary>
        /// 배경음악 재생
        /// </summary>
        /// <param name="options">배경음악 옵션</param>
        public static void PlayBackgroundMusic(BackgroundMusicOptions options)
        {
            AITSDKManagerHandler.Instance.PlayBackgroundMusic(options);
        }

        /// <summary>
        /// 배경음악 일시정지
        /// </summary>
        public static void PauseBackgroundMusic()
        {
            AITSDKManagerHandler.Instance.PauseBackgroundMusic();
        }

        /// <summary>
        /// 배경음악 재개
        /// </summary>
        public static void ResumeBackgroundMusic()
        {
            AITSDKManagerHandler.Instance.ResumeBackgroundMusic();
        }

        /// <summary>
        /// 배경음악 정지
        /// </summary>
        public static void StopBackgroundMusic()
        {
            AITSDKManagerHandler.Instance.StopBackgroundMusic();
        }

        /// <summary>
        /// 배경음악 볼륨 설정
        /// </summary>
        /// <param name="volume">볼륨 (0.0 ~ 1.0)</param>
        public static void SetBackgroundMusicVolume(float volume)
        {
            AITSDKManagerHandler.Instance.SetBackgroundMusicVolume(volume);
        }

        #endregion

        #region File System APIs

        /// <summary>
        /// 파일 시스템 초기화
        /// </summary>
        /// <param name="options">초기화 옵션</param>
        public static void InitFileSystem(FileSystemOptions options)
        {
            AITSDKManagerHandler.Instance.InitFileSystem(options);
        }

        /// <summary>
        /// 파일 쓰기
        /// </summary>
        /// <param name="options">파일 쓰기 옵션</param>
        public static void WriteFile(WriteFileOptions options)
        {
            AITSDKManagerHandler.Instance.WriteFile(options);
        }

        /// <summary>
        /// 파일 읽기
        /// </summary>
        /// <param name="options">파일 읽기 옵션</param>
        public static void ReadFile(ReadFileOptions options)
        {
            AITSDKManagerHandler.Instance.ReadFile(options);
        }

        /// <summary>
        /// 파일 삭제
        /// </summary>
        /// <param name="options">파일 삭제 옵션</param>
        public static void UnlinkFile(UnlinkFileOptions options)
        {
            AITSDKManagerHandler.Instance.UnlinkFile(options);
        }

        /// <summary>
        /// 파일 복사
        /// </summary>
        /// <param name="options">파일 복사 옵션</param>
        public static void CopyFile(CopyFileOptions options)
        {
            AITSDKManagerHandler.Instance.CopyFile(options);
        }

        /// <summary>
        /// 파일 정보 조회
        /// </summary>
        /// <param name="options">파일 정보 조회 옵션</param>
        public static void GetFileStats(FileStatsOptions options)
        {
            AITSDKManagerHandler.Instance.GetFileStats(options);
        }

        /// <summary>
        /// 디렉토리 생성
        /// </summary>
        /// <param name="options">디렉토리 생성 옵션</param>
        public static void MkDir(MkDirOptions options)
        {
            AITSDKManagerHandler.Instance.MkDir(options);
        }

        /// <summary>
        /// 디렉토리 내용 읽기
        /// </summary>
        /// <param name="options">디렉토리 읽기 옵션</param>
        public static void ReadDir(ReadDirOptions options)
        {
            AITSDKManagerHandler.Instance.ReadDir(options);
        }

        /// <summary>
        /// 저장소 정보 조회
        /// </summary>
        /// <param name="options">저장소 정보 조회 옵션</param>
        public static void GetStorageInfo(StorageInfoOptions options)
        {
            AITSDKManagerHandler.Instance.GetStorageInfo(options);
        }

        /// <summary>
        /// 캐시 파일 정리
        /// </summary>
        /// <param name="options">캐시 정리 옵션</param>
        public static void ClearCache(ClearCacheOptions options)
        {
            AITSDKManagerHandler.Instance.ClearCache(options);
        }

        #endregion

        #region Sensors APIs

        /// <summary>
        /// 가속도계 시작
        /// </summary>
        /// <param name="options">가속도계 옵션</param>
        public static void StartAccelerometer(AccelerometerOptions options)
        {
            AITSDKManagerHandler.Instance.StartAccelerometer(options);
        }

        /// <summary>
        /// 가속도계 중지
        /// </summary>
        public static void StopAccelerometer()
        {
            AITSDKManagerHandler.Instance.StopAccelerometer();
        }

        /// <summary>
        /// 자이로스코프 시작
        /// </summary>
        /// <param name="options">자이로스코프 옵션</param>
        public static void StartGyroscope(GyroscopeOptions options)
        {
            AITSDKManagerHandler.Instance.StartGyroscope(options);
        }

        /// <summary>
        /// 자이로스코프 중지
        /// </summary>
        public static void StopGyroscope()
        {
            AITSDKManagerHandler.Instance.StopGyroscope();
        }

        /// <summary>
        /// 나침반 시작
        /// </summary>
        /// <param name="options">나침반 옵션</param>
        public static void StartCompass(CompassOptions options)
        {
            AITSDKManagerHandler.Instance.StartCompass(options);
        }

        /// <summary>
        /// 나침반 중지
        /// </summary>
        public static void StopCompass()
        {
            AITSDKManagerHandler.Instance.StopCompass();
        }

        /// <summary>
        /// 기기 방향 감지 시작
        /// </summary>
        /// <param name="options">기기 방향 옵션</param>
        public static void StartDeviceMotion(DeviceMotionOptions options)
        {
            AITSDKManagerHandler.Instance.StartDeviceMotion(options);
        }

        /// <summary>
        /// 기기 방향 감지 중지
        /// </summary>
        public static void StopDeviceMotion()
        {
            AITSDKManagerHandler.Instance.StopDeviceMotion();
        }

        /// <summary>
        /// 센서 데이터 콜백 등록
        /// </summary>
        /// <param name="options">센서 콜백 등록 옵션</param>
        public static void OnSensorChange(SensorCallbackOptions options)
        {
            AITSDKManagerHandler.Instance.OnSensorChange(options);
        }

        /// <summary>
        /// 센서 데이터 콜백 해제
        /// </summary>
        /// <param name="options">센서 콜백 해제 옵션</param>
        public static void OffSensorChange(SensorCallbackOptions options)
        {
            AITSDKManagerHandler.Instance.OffSensorChange(options);
        }

        /// <summary>
        /// 센서 권한 상태 확인
        /// </summary>
        /// <param name="options">센서 권한 확인 옵션</param>
        public static void CheckSensorPermissions(SensorPermissionOptions options)
        {
            AITSDKManagerHandler.Instance.CheckSensorPermissions(options);
        }

        /// <summary>
        /// 모든 센서 중지
        /// </summary>
        public static void StopAllSensors()
        {
            AITSDKManagerHandler.Instance.StopAllSensors();
        }

        #endregion

        #region Performance APIs

        /// <summary>
        /// 성능 모니터링 시작
        /// </summary>
        /// <param name="options">성능 모니터링 옵션</param>
        public static void StartPerformanceMonitoring(PerformanceMonitorOptions options)
        {
            AITSDKManagerHandler.Instance.StartPerformanceMonitoring(options);
        }

        /// <summary>
        /// 성능 모니터링 중지
        /// </summary>
        public static void StopPerformanceMonitoring()
        {
            AITSDKManagerHandler.Instance.StopPerformanceMonitoring();
        }

        /// <summary>
        /// 성능 보고서 생성
        /// </summary>
        /// <param name="options">성능 보고서 옵션</param>
        public static void GetPerformanceReport(PerformanceReportOptions options)
        {
            AITSDKManagerHandler.Instance.GetPerformanceReport(options);
        }

        /// <summary>
        /// 커스텀 메트릭 보고
        /// </summary>
        /// <param name="options">커스텀 메트릭 옵션</param>
        public static void ReportCustomMetric(CustomMetricOptions options)
        {
            AITSDKManagerHandler.Instance.ReportCustomMetric(options);
        }

        /// <summary>
        /// 메모리 경고 리스너 등록
        /// </summary>
        /// <param name="options">메모리 경고 옵션</param>
        public static void OnMemoryWarning(MemoryWarningOptions options)
        {
            AITSDKManagerHandler.Instance.OnMemoryWarning(options);
        }

        /// <summary>
        /// 성능 이벤트 콜백 등록
        /// </summary>
        /// <param name="options">성능 이벤트 콜백 옵션</param>
        public static void OnPerformanceEvent(PerformanceEventOptions options)
        {
            AITSDKManagerHandler.Instance.OnPerformanceEvent(options);
        }

        #endregion
    }

    #region Data Structures

    /// <summary>
    /// 기본 결과 클래스
    /// </summary>
    [System.Serializable]
    public class BaseResult
    {
        public bool success;
        public string message;
        public int errorCode;
    }

    /// <summary>
    /// 초기화 결과
    /// </summary>
    [System.Serializable]
    public class InitResult : BaseResult
    {
        public string sdkVersion;
        public string platformVersion;
    }

    /// <summary>
    /// 로그인 상태 결과
    /// </summary>
    [System.Serializable]
    public class LoginStatusResult : BaseResult
    {
        public bool isLoggedIn;
        public string userId;
    }

    /// <summary>
    /// 로그인 옵션
    /// </summary>
    [System.Serializable]
    public class LoginOptions
    {
        public Action<UserInfoResult> onSuccess;
        public Action<BaseResult> onFailure;
        public bool requestUserInfo = true;
    }

    /// <summary>
    /// 사용자 정보 결과
    /// </summary>
    [System.Serializable]
    public class UserInfoResult : BaseResult
    {
        public string userId;
        public string nickname;
        public string profileImage;
        public string email;
        public string phone;
    }

    /// <summary>
    /// 결제 옵션
    /// </summary>
    [System.Serializable]
    public class PaymentOptions
    {
        public int amount;
        public string productName;
        public string productId;
        public string orderId;
        public string customerKey;
        public Action<PaymentResult> onSuccess;
        public Action<BaseResult> onFailure;
        public Action onCancel;
    }

    /// <summary>
    /// 결제 결과
    /// </summary>
    [System.Serializable]
    public class PaymentResult : BaseResult
    {
        public string paymentKey;
        public string orderId;
        public int amount;
        public string status;
        public string approvedAt;
    }

    /// <summary>
    /// 배너 광고 옵션
    /// </summary>
    [System.Serializable]
    public class BannerAdOptions
    {
        public string adUnitId;
        public BannerAdPosition position = BannerAdPosition.Bottom;
        public Action<BaseResult> onLoaded;
        public Action<BaseResult> onFailedToLoad;
        public Action onClicked;
    }

    /// <summary>
    /// 전면 광고 옵션
    /// </summary>
    [System.Serializable]
    public class InterstitialAdOptions
    {
        public string adUnitId;
        public Action<BaseResult> onLoaded;
        public Action<BaseResult> onFailedToLoad;
        public Action onShown;
        public Action onClosed;
        public Action onClicked;
    }

    /// <summary>
    /// 보상형 광고 옵션
    /// </summary>
    [System.Serializable]
    public class RewardedAdOptions
    {
        public string adUnitId;
        public Action<BaseResult> onLoaded;
        public Action<BaseResult> onFailedToLoad;
        public Action onShown;
        public Action<RewardResult> onRewarded;
        public Action onClosed;
    }

    /// <summary>
    /// 보상 결과
    /// </summary>
    [System.Serializable]
    public class RewardResult : BaseResult
    {
        public string rewardType;
        public int rewardAmount;
    }

    /// <summary>
    /// 스토리지 데이터 결과
    /// </summary>
    [System.Serializable]
    public class StorageDataResult : BaseResult
    {
        public string key;
        public string value;
    }

    /// <summary>
    /// 텍스트 공유 옵션
    /// </summary>
    [System.Serializable]
    public class ShareTextOptions
    {
        public string text;
        public string title;
        public Action<BaseResult> onComplete;
        public Action<BaseResult> onCancel;
    }

    /// <summary>
    /// 링크 공유 옵션
    /// </summary>
    [System.Serializable]
    public class ShareLinkOptions
    {
        public string url;
        public string title;
        public string description;
        public string imageUrl;
        public Action<BaseResult> onComplete;
        public Action<BaseResult> onCancel;
    }

    /// <summary>
    /// 이미지 공유 옵션
    /// </summary>
    [System.Serializable]
    public class ShareImageOptions
    {
        public string imageUrl;
        public string title;
        public string description;
        public Action<BaseResult> onComplete;
        public Action<BaseResult> onCancel;
    }

    /// <summary>
    /// 토스트 옵션
    /// </summary>
    [System.Serializable]
    public class ToastOptions
    {
        public string message;
        public ToastDuration duration = ToastDuration.Short;
        public ToastPosition position = ToastPosition.Bottom;
    }

    /// <summary>
    /// 다이얼로그 옵션
    /// </summary>
    [System.Serializable]
    public class DialogOptions
    {
        public string title;
        public string message;
        public string confirmText = "확인";
        public string cancelText = "취소";
        public bool showCancel = true;
        public Action onConfirm;
        public Action onCancel;
    }

    /// <summary>
    /// 네트워크 타입 결과
    /// </summary>
    [System.Serializable]
    public class NetworkTypeResult : BaseResult
    {
        public NetworkType networkType;
        public bool isConnected;
    }

    /// <summary>
    /// 기기 정보 결과
    /// </summary>
    [System.Serializable]
    public class DeviceInfoResult : BaseResult
    {
        public string model;
        public string brand;
        public string system;
        public string version;
        public string platform;
        public string language;
        public int screenWidth;
        public int screenHeight;
        public float pixelRatio;
    }

    /// <summary>
    /// 위치 옵션
    /// </summary>
    [System.Serializable]
    public class LocationOptions
    {
        public LocationAccuracy accuracy = LocationAccuracy.Best;
        public int timeout = 30000; // ms
        public Action<LocationResult> onSuccess;
        public Action<BaseResult> onFailure;
    }

    /// <summary>
    /// 위치 결과
    /// </summary>
    [System.Serializable]
    public class LocationResult : BaseResult
    {
        public double latitude;
        public double longitude;
        public float accuracy;
        public double altitude;
        public float speed;
        public long timestamp;
    }

    /// <summary>
    /// 카메라 옵션
    /// </summary>
    [System.Serializable]
    public class CameraOptions
    {
        public CameraSource source = CameraSource.Camera;
        public ImageQuality quality = ImageQuality.High;
        public bool allowEdit = false;
        public Action<ImageResult> onSuccess;
        public Action<BaseResult> onFailure;
        public Action onCancel;
    }

    /// <summary>
    /// 이미지 선택 옵션
    /// </summary>
    [System.Serializable]
    public class ChooseImageOptions
    {
        public int count = 1;
        public ImageQuality quality = ImageQuality.High;
        public Action<ImageListResult> onSuccess;
        public Action<BaseResult> onFailure;
        public Action onCancel;
    }

    /// <summary>
    /// 이미지 결과
    /// </summary>
    [System.Serializable]
    public class ImageResult : BaseResult
    {
        public string path;
        public string base64;
        public int width;
        public int height;
        public long size;
    }

    /// <summary>
    /// 이미지 리스트 결과
    /// </summary>
    [System.Serializable]
    public class ImageListResult : BaseResult
    {
        public ImageResult[] images;
    }

    /// <summary>
    /// 클립보드 텍스트 결과
    /// </summary>
    [System.Serializable]
    public class ClipboardTextResult : BaseResult
    {
        public string text;
    }

    /// <summary>
    /// 앱 버전 결과
    /// </summary>
    [System.Serializable]
    public class AppVersionResult : BaseResult
    {
        public string currentVersion;
        public string latestVersion;
        public bool updateAvailable;
        public bool forceUpdate;
        public string updateUrl;
    }

    /// <summary>
    /// 권한 결과
    /// </summary>
    [System.Serializable]
    public class PermissionResult : BaseResult
    {
        public bool granted;
        public string permission;
    }

    #region Audio System Data Structures

    /// <summary>
    /// 오디오 컨텍스트 옵션
    /// </summary>
    [System.Serializable]
    public class AudioContextOptions
    {
        public string gameObject;
        public string onLoadStart;
        public string onCanPlay;
        public string onPlay;
        public string onPause;
        public string onEnded;
        public string onTimeUpdate;
        public string onError;
        public bool useWebAudioImplement = false;
    }

    /// <summary>
    /// 배경음악 옵션
    /// </summary>
    [System.Serializable]
    public class BackgroundMusicOptions
    {
        public string src;
        public float volume = 0.5f;
        public bool loop = true;
        public string gameObject;
        public string onCanPlayCallback;
        public string onErrorCallback;
    }

    /// <summary>
    /// 오디오 정보 결과
    /// </summary>
    [System.Serializable]
    public class AudioInfoResult : BaseResult
    {
        public int audioId;
        public AudioState state;
        public float currentTime;
        public float duration;
        public float volume;
        public bool loop;
        public float playbackRate;
        public string src;
    }

    #endregion

    #region File System Data Structures

    /// <summary>
    /// 파일 시스템 옵션
    /// </summary>
    [System.Serializable]
    public class FileSystemOptions
    {
        public string gameObject;
        public string onInitCallback;
    }

    /// <summary>
    /// 파일 쓰기 옵션
    /// </summary>
    [System.Serializable]
    public class WriteFileOptions
    {
        public string filePath;
        public string data;
        public string encoding = "utf8";
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 파일 읽기 옵션
    /// </summary>
    [System.Serializable]
    public class ReadFileOptions
    {
        public string filePath;
        public string encoding = "utf8";
        public int position = 0;
        public int length = -1;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 파일 삭제 옵션
    /// </summary>
    [System.Serializable]
    public class UnlinkFileOptions
    {
        public string filePath;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 파일 복사 옵션
    /// </summary>
    [System.Serializable]
    public class CopyFileOptions
    {
        public string srcPath;
        public string destPath;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 파일 정보 조회 옵션
    /// </summary>
    [System.Serializable]
    public class FileStatsOptions
    {
        public string filePath;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 디렉토리 생성 옵션
    /// </summary>
    [System.Serializable]
    public class MkDirOptions
    {
        public string dirPath;
        public bool recursive = true;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 디렉토리 읽기 옵션
    /// </summary>
    [System.Serializable]
    public class ReadDirOptions
    {
        public string dirPath;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 저장소 정보 조회 옵션
    /// </summary>
    [System.Serializable]
    public class StorageInfoOptions
    {
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 캐시 정리 옵션
    /// </summary>
    [System.Serializable]
    public class ClearCacheOptions
    {
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 파일 정보 결과
    /// </summary>
    [System.Serializable]
    public class FileStatsResult : BaseResult
    {
        public FileStats stats;
    }

    /// <summary>
    /// 파일 통계 정보
    /// </summary>
    [System.Serializable]
    public class FileStats
    {
        public string path;
        public long size;
        public long modifiedTime;
        public bool isFile;
        public bool isDirectory;
        public string type;
    }

    /// <summary>
    /// 디렉토리 읽기 결과
    /// </summary>
    [System.Serializable]
    public class ReadDirResult : BaseResult
    {
        public string[] files;
        public string dirPath;
    }

    /// <summary>
    /// 저장소 정보 결과
    /// </summary>
    [System.Serializable]
    public class StorageInfoResult : BaseResult
    {
        public StorageInfo storageInfo;
    }

    /// <summary>
    /// 저장소 정보
    /// </summary>
    [System.Serializable]
    public class StorageInfo
    {
        public long usedSize;
        public long maxSize;
        public long availableSize;
        public int fileCount;
        public int usagePercent;
    }

    #endregion

    #region Sensors Data Structures

    /// <summary>
    /// 가속도계 옵션
    /// </summary>
    [System.Serializable]
    public class AccelerometerOptions
    {
        public SensorInterval interval = SensorInterval.UI;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 자이로스코프 옵션
    /// </summary>
    [System.Serializable]
    public class GyroscopeOptions
    {
        public SensorInterval interval = SensorInterval.UI;
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 나침반 옵션
    /// </summary>
    [System.Serializable]
    public class CompassOptions
    {
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 기기 방향 옵션
    /// </summary>
    [System.Serializable]
    public class DeviceMotionOptions
    {
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 센서 콜백 옵션
    /// </summary>
    [System.Serializable]
    public class SensorCallbackOptions
    {
        public SensorType sensorType;
        public string gameObject;
        public string callback;
    }

    /// <summary>
    /// 센서 권한 옵션
    /// </summary>
    [System.Serializable]
    public class SensorPermissionOptions
    {
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 가속도계 데이터
    /// </summary>
    [System.Serializable]
    public class AccelerometerData
    {
        public float x;
        public float y;
        public float z;
        public long timestamp;
    }

    /// <summary>
    /// 자이로스코프 데이터
    /// </summary>
    [System.Serializable]
    public class GyroscopeData
    {
        public float x; // beta (전후 기울기)
        public float y; // gamma (좌우 기울기)
        public float z; // alpha (나침반 방향)
        public long timestamp;
    }

    /// <summary>
    /// 나침반 데이터
    /// </summary>
    [System.Serializable]
    public class CompassData
    {
        public float direction;
        public float accuracy;
        public long timestamp;
    }

    /// <summary>
    /// 기기 방향 데이터
    /// </summary>
    [System.Serializable]
    public class DeviceMotionData
    {
        public float alpha; // Z축 회전 (0-360도)
        public float beta;  // X축 회전 (-180~180도)
        public float gamma; // Y축 회전 (-90~90도)
        public bool absolute;
        public long timestamp;
    }

    /// <summary>
    /// 센서 권한 결과
    /// </summary>
    [System.Serializable]
    public class SensorPermissionResult : BaseResult
    {
        public SensorPermissions permissions;
    }

    /// <summary>
    /// 센서 권한 정보
    /// </summary>
    [System.Serializable]
    public class SensorPermissions
    {
        public bool accelerometer;
        public bool gyroscope;
        public bool magnetometer;
    }

    #endregion

    #region Performance Data Structures

    /// <summary>
    /// 성능 모니터 옵션
    /// </summary>
    [System.Serializable]
    public class PerformanceMonitorOptions
    {
        public int interval = 1000; // ms
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 성능 보고서 옵션
    /// </summary>
    [System.Serializable]
    public class PerformanceReportOptions
    {
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 커스텀 메트릭 옵션
    /// </summary>
    [System.Serializable]
    public class CustomMetricOptions
    {
        public string name;
        public float value;
        public string type = "numeric";
        public string gameObject;
        public string onSuccess;
        public string onFail;
    }

    /// <summary>
    /// 메모리 경고 옵션
    /// </summary>
    [System.Serializable]
    public class MemoryWarningOptions
    {
        public string gameObject;
        public string onMemoryWarning;
    }

    /// <summary>
    /// 성능 이벤트 옵션
    /// </summary>
    [System.Serializable]
    public class PerformanceEventOptions
    {
        public string eventType;
        public string gameObject;
        public string callback;
    }

    /// <summary>
    /// 성능 보고서 결과
    /// </summary>
    [System.Serializable]
    public class PerformanceReportResult : BaseResult
    {
        public PerformanceReport report;
    }

    /// <summary>
    /// 성능 보고서
    /// </summary>
    [System.Serializable]
    public class PerformanceReport
    {
        public float timestamp;
        public float uptime;
        public PerformanceMetrics metrics;
        public SystemInfo systemInfo;
        public PerformanceEntries performanceEntries;
        public PerformanceRecommendation[] recommendations;
    }

    /// <summary>
    /// 성능 메트릭
    /// </summary>
    [System.Serializable]
    public class PerformanceMetrics
    {
        public MemoryMetrics memory;
        public FPSMetrics fps;
        public LoadingMetrics loading;
        public RenderingMetrics rendering;
        public NetworkMetrics network;
    }

    /// <summary>
    /// 메모리 메트릭
    /// </summary>
    [System.Serializable]
    public class MemoryMetrics
    {
        public long used;
        public long total;
        public int percentage;
    }

    /// <summary>
    /// FPS 메트릭
    /// </summary>
    [System.Serializable]
    public class FPSMetrics
    {
        public int current;
        public int average;
        public int[] history;
    }

    /// <summary>
    /// 로딩 메트릭
    /// </summary>
    [System.Serializable]
    public class LoadingMetrics
    {
        public int total;
        public int completed;
        public int failed;
    }

    /// <summary>
    /// 렌더링 메트릭
    /// </summary>
    [System.Serializable]
    public class RenderingMetrics
    {
        public int drawCalls;
        public int triangles;
        public int setPassCalls;
        public string renderer;
        public string vendor;
    }

    /// <summary>
    /// 네트워크 메트릭
    /// </summary>
    [System.Serializable]
    public class NetworkMetrics
    {
        public int requests;
        public float totalTime;
        public float averageTime;
    }

    /// <summary>
    /// 시스템 정보
    /// </summary>
    [System.Serializable]
    public class SystemInfo
    {
        public string userAgent;
        public string platform;
        public int hardwareConcurrency;
        public string deviceMemory;
        public ConnectionInfo connection;
    }

    /// <summary>
    /// 연결 정보
    /// </summary>
    [System.Serializable]
    public class ConnectionInfo
    {
        public string effectiveType;
        public float downlink;
        public int rtt;
        public bool saveData;
    }

    /// <summary>
    /// 성능 엔트리
    /// </summary>
    [System.Serializable]
    public class PerformanceEntries
    {
        public PerformanceEntry[] navigation;
        public PerformanceEntry[] resource;
        public PerformanceEntry[] measure;
        public PerformanceEntry[] mark;
    }

    /// <summary>
    /// 성능 엔트리 항목
    /// </summary>
    [System.Serializable]
    public class PerformanceEntry
    {
        public string name;
        public float startTime;
        public float duration;
        public float loadEventEnd;
        public float domContentLoadedEventEnd;
        public long transferSize;
        public long encodedBodySize;
    }

    /// <summary>
    /// 성능 최적화 권장사항
    /// </summary>
    [System.Serializable]
    public class PerformanceRecommendation
    {
        public string type;
        public string level; // info, warning, error
        public string message;
        public string suggestion;
    }

    /// <summary>
    /// 메모리 경고 결과
    /// </summary>
    [System.Serializable]
    public class MemoryWarningResult : BaseResult
    {
        public string level; // warning, critical
        public long usedMemory;
        public long totalMemory;
        public int percentage;
    }

    #endregion

    #endregion

    #region Enums

    public enum VibrationType
    {
        Light,
        Medium,
        Heavy
    }

    public enum ToastDuration
    {
        Short = 2000,
        Long = 3500
    }

    public enum ToastPosition
    {
        Top,
        Center,
        Bottom
    }

    public enum NetworkType
    {
        None,
        Wifi,
        Mobile2G,
        Mobile3G,
        Mobile4G,
        Mobile5G,
        Unknown
    }

    public enum LocationAccuracy
    {
        Best,
        Good,
        Low
    }

    public enum CameraSource
    {
        Camera,
        Album,
        Both
    }

    public enum ImageQuality
    {
        Low,
        Medium,
        High,
        Original
    }

    public enum BannerAdPosition
    {
        Top,
        Bottom
    }

    /// <summary>
    /// 오디오 상태
    /// </summary>
    public enum AudioState
    {
        Idle = 1,
        Loading = 2,
        Playing = 3,
        Paused = 4,
        Stopped = 5,
        Error = -1
    }

    /// <summary>
    /// 센서 인터벌
    /// </summary>
    public enum SensorInterval
    {
        UI,      // 60ms (16.7fps)
        Game,    // 20ms (50fps)  
        Normal   // 200ms (5fps)
    }

    /// <summary>
    /// 센서 타입
    /// </summary>
    public enum SensorType
    {
        Accelerometer,
        Gyroscope,
        Compass,
        DeviceMotion
    }

    #endregion
}
#endif