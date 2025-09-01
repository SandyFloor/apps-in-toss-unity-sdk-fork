# Apps in Toss Unity SDK API 참조 문서

## 목차
1. [초기화](#초기화)
2. [사용자 인증](#사용자-인증)
3. [결제 시스템](#결제-시스템)
4. [광고 시스템](#광고-시스템)
5. [오디오 시스템](#오디오-시스템)
6. [파일 시스템](#파일-시스템)
7. [센서 시스템](#센서-시스템)
8. [성능 모니터링](#성능-모니터링)
9. [데이터 저장소](#데이터-저장소)
10. [공유 기능](#공유-기능)
11. [디바이스 기능](#디바이스-기능)
12. [분석 도구](#분석-도구)

## 초기화

### AIT.Init()
Apps in Toss SDK를 초기화합니다. 앱 시작 시 반드시 호출해야 합니다.

```csharp
public static void Init(Action<InitResult> callback = null)
```

**예제:**
```csharp
AIT.Init((result) => {
    if (result.success) {
        Debug.Log($"SDK 초기화 성공: {result.sdkVersion}");
    } else {
        Debug.LogError($"SDK 초기화 실패: {result.message}");
    }
});
```

## 사용자 인증

### AIT.CheckLoginStatus()
현재 로그인 상태를 확인합니다.

```csharp
public static void CheckLoginStatus(Action<LoginStatusResult> callback = null)
```

### AIT.Login()
토스 계정으로 로그인합니다.

```csharp
public static void Login(LoginOptions options)
```

**예제:**
```csharp
AIT.Login(new LoginOptions {
    requestUserInfo = true,
    onSuccess = (userInfo) => {
        Debug.Log($"로그인 성공: {userInfo.nickname}");
    },
    onFailure = (error) => {
        Debug.LogError($"로그인 실패: {error.message}");
    }
});
```

### AIT.Logout()
현재 사용자를 로그아웃합니다.

```csharp
public static void Logout(Action<BaseResult> callback = null)
```

### AIT.GetUserInfo()
사용자 정보를 조회합니다.

```csharp
public static void GetUserInfo(Action<UserInfoResult> callback)
```

## 결제 시스템

### AIT.RequestPayment()
토스페이먼츠를 통한 결제를 요청합니다.

```csharp
public static void RequestPayment(PaymentOptions options)
```

**예제:**
```csharp
AIT.RequestPayment(new PaymentOptions {
    amount = 1000,
    productName = "골드 100개",
    productId = "gold_100",
    orderId = "order_" + System.DateTime.Now.Ticks,
    customerKey = "customer_123",
    onSuccess = (result) => {
        Debug.Log($"결제 성공: {result.paymentKey}");
        // 게임 아이템 지급 로직
    },
    onFailure = (error) => {
        Debug.LogError($"결제 실패: {error.message}");
    },
    onCancel = () => {
        Debug.Log("결제가 취소되었습니다.");
    }
});
```

## 광고 시스템

### AIT.ShowBannerAd()
배너 광고를 표시합니다.

```csharp
public static void ShowBannerAd(BannerAdOptions options)
```

**예제:**
```csharp
AIT.ShowBannerAd(new BannerAdOptions {
    adUnitId = "banner_ad_unit_id",
    position = BannerAdPosition.Bottom,
    onLoaded = (result) => Debug.Log("배너 광고 로드 완료"),
    onFailedToLoad = (error) => Debug.LogError($"배너 광고 로드 실패: {error.message}"),
    onClicked = () => Debug.Log("배너 광고 클릭됨")
});
```

### AIT.ShowInterstitialAd()
전면 광고를 표시합니다.

```csharp
public static void ShowInterstitialAd(InterstitialAdOptions options)
```

### AIT.ShowRewardedAd()
보상형 광고를 표시합니다.

```csharp
public static void ShowRewardedAd(RewardedAdOptions options)
```

**예제:**
```csharp
AIT.ShowRewardedAd(new RewardedAdOptions {
    adUnitId = "rewarded_ad_unit_id",
    onLoaded = (result) => Debug.Log("보상형 광고 로드 완료"),
    onRewarded = (reward) => {
        Debug.Log($"보상 획득: {reward.rewardType} x{reward.rewardAmount}");
        // 보상 지급 로직
    },
    onClosed = () => Debug.Log("보상형 광고 닫힘")
});
```

## 오디오 시스템

### AIT.CreateAudioContext()
새로운 오디오 컨텍스트를 생성합니다.

```csharp
public static int CreateAudioContext(AudioContextOptions options)
```

**예제:**
```csharp
var audioOptions = new AudioContextOptions {
    gameObject = gameObject.name,
    onCanPlay = "OnAudioCanPlay",
    onPlay = "OnAudioPlay",
    onEnded = "OnAudioEnded",
    onError = "OnAudioError"
};
int audioId = AIT.CreateAudioContext(audioOptions);
```

### AIT.PlayAudio()
오디오를 재생합니다.

```csharp
public static void PlayAudio(int audioId)
```

### AIT.PauseAudio()
오디오를 일시정지합니다.

```csharp
public static void PauseAudio(int audioId)
```

### AIT.SetAudioVolume()
오디오 볼륨을 설정합니다.

```csharp
public static void SetAudioVolume(int audioId, float volume)
```

**예제:**
```csharp
// 오디오 생성 및 재생
int bgmId = AIT.CreateAudioContext(audioOptions);
AIT.SetAudioSource(bgmId, "https://example.com/background-music.mp3");
AIT.SetAudioVolume(bgmId, 0.7f);
AIT.SetAudioLoop(bgmId, true);
AIT.PlayAudio(bgmId);
```

### AIT.PlayBackgroundMusic()
배경음악을 재생합니다.

```csharp
public static void PlayBackgroundMusic(BackgroundMusicOptions options)
```

**예제:**
```csharp
AIT.PlayBackgroundMusic(new BackgroundMusicOptions {
    src = "https://example.com/bgm.mp3",
    volume = 0.5f,
    loop = true,
    gameObject = gameObject.name,
    onCanPlayCallback = "OnBGMReady"
});
```

## 파일 시스템

### AIT.InitFileSystem()
파일 시스템을 초기화합니다.

```csharp
public static void InitFileSystem(FileSystemOptions options)
```

### AIT.WriteFile()
파일을 생성하고 데이터를 씁니다.

```csharp
public static void WriteFile(WriteFileOptions options)
```

**예제:**
```csharp
AIT.WriteFile(new WriteFileOptions {
    filePath = "/AppsInToss/userData/savegame.json",
    data = JsonUtility.ToJson(gameData),
    encoding = "utf8",
    gameObject = gameObject.name,
    onSuccess = "OnFileSaved",
    onFail = "OnFileSaveFailed"
});
```

### AIT.ReadFile()
파일을 읽습니다.

```csharp
public static void ReadFile(ReadFileOptions options)
```

**예제:**
```csharp
AIT.ReadFile(new ReadFileOptions {
    filePath = "/AppsInToss/userData/savegame.json",
    encoding = "utf8",
    gameObject = gameObject.name,
    onSuccess = "OnFileLoaded",
    onFail = "OnFileLoadFailed"
});
```

### AIT.GetStorageInfo()
저장소 사용량 정보를 조회합니다.

```csharp
public static void GetStorageInfo(StorageInfoOptions options)
```

**예제:**
```csharp
AIT.GetStorageInfo(new StorageInfoOptions {
    gameObject = gameObject.name,
    onSuccess = "OnStorageInfoReceived"
});

void OnStorageInfoReceived(string resultJson) {
    var result = JsonUtility.FromJson<StorageInfoResult>(resultJson);
    if (result.success) {
        Debug.Log($"사용량: {result.storageInfo.usedSize / 1024 / 1024}MB / " +
                 $"{result.storageInfo.maxSize / 1024 / 1024}MB");
    }
}
```

## 센서 시스템

### AIT.StartAccelerometer()
가속도계를 시작합니다.

```csharp
public static void StartAccelerometer(AccelerometerOptions options)
```

**예제:**
```csharp
AIT.StartAccelerometer(new AccelerometerOptions {
    interval = SensorInterval.UI,
    gameObject = gameObject.name,
    onSuccess = "OnAccelerometerStarted",
    onFail = "OnAccelerometerFailed"
});

// 센서 데이터 콜백 등록
AIT.OnSensorChange(new SensorCallbackOptions {
    sensorType = SensorType.Accelerometer,
    gameObject = gameObject.name,
    callback = "OnAccelerometerData"
});
```

### AIT.StartGyroscope()
자이로스코프를 시작합니다.

```csharp
public static void StartGyroscope(GyroscopeOptions options)
```

### AIT.StartCompass()
나침반을 시작합니다.

```csharp
public static void StartCompass(CompassOptions options)
```

**예제:**
```csharp
void OnAccelerometerData(string dataJson) {
    var sensorData = JsonUtility.FromJson<SensorDataWrapper>(dataJson);
    var accelData = JsonUtility.FromJson<AccelerometerData>(sensorData.result);
    
    // 가속도 데이터 활용 (기울기 감지, 흔들기 감지 등)
    float totalAccel = Mathf.Sqrt(accelData.x * accelData.x + 
                                  accelData.y * accelData.y + 
                                  accelData.z * accelData.z);
    
    if (totalAccel > 15.0f) {
        Debug.Log("강한 움직임 감지!");
        TriggerShakeEffect();
    }
}
```

### AIT.CheckSensorPermissions()
센서 권한 상태를 확인합니다.

```csharp
public static void CheckSensorPermissions(SensorPermissionOptions options)
```

## 성능 모니터링

### AIT.StartPerformanceMonitoring()
성능 모니터링을 시작합니다.

```csharp
public static void StartPerformanceMonitoring(PerformanceMonitorOptions options)
```

**예제:**
```csharp
AIT.StartPerformanceMonitoring(new PerformanceMonitorOptions {
    interval = 2000, // 2초마다 수집
    gameObject = gameObject.name,
    onSuccess = "OnMonitoringStarted",
    onFail = "OnMonitoringFailed"
});

// 성능 메트릭 업데이트 콜백 등록
AIT.OnPerformanceEvent(new PerformanceEventOptions {
    eventType = "metricsUpdate",
    gameObject = gameObject.name,
    callback = "OnPerformanceMetrics"
});
```

### AIT.GetPerformanceReport()
상세한 성능 보고서를 생성합니다.

```csharp
public static void GetPerformanceReport(PerformanceReportOptions options)
```

**예제:**
```csharp
AIT.GetPerformanceReport(new PerformanceReportOptions {
    gameObject = gameObject.name,
    onSuccess = "OnPerformanceReportReceived"
});

void OnPerformanceReportReceived(string resultJson) {
    var result = JsonUtility.FromJson<PerformanceReportResult>(resultJson);
    if (result.success) {
        var report = result.report;
        Debug.Log($"FPS: {report.metrics.fps.current} (평균: {report.metrics.fps.average})");
        Debug.Log($"메모리 사용률: {report.metrics.memory.percentage}%");
        
        // 성능 최적화 권장사항 처리
        foreach (var recommendation in report.recommendations) {
            Debug.Log($"[{recommendation.level}] {recommendation.message}");
        }
    }
}
```

### AIT.ReportCustomMetric()
커스텀 메트릭을 보고합니다.

```csharp
public static void ReportCustomMetric(CustomMetricOptions options)
```

**예제:**
```csharp
// 게임 특화 메트릭 보고
AIT.ReportCustomMetric(new CustomMetricOptions {
    name = "enemy_spawn_time",
    value = Time.time - lastEnemySpawnTime,
    type = "duration",
    gameObject = gameObject.name
});
```

### AIT.OnMemoryWarning()
메모리 경고 리스너를 등록합니다.

```csharp
public static void OnMemoryWarning(MemoryWarningOptions options)
```

**예제:**
```csharp
AIT.OnMemoryWarning(new MemoryWarningOptions {
    gameObject = gameObject.name,
    onMemoryWarning = "OnMemoryWarningReceived"
});

void OnMemoryWarningReceived(string resultJson) {
    var result = JsonUtility.FromJson<MemoryWarningResult>(resultJson);
    Debug.LogWarning($"메모리 경고: {result.level} ({result.percentage}% 사용)");
    
    if (result.level == "critical") {
        // 메모리 정리 로직
        Resources.UnloadUnusedAssets();
        System.GC.Collect();
    }
}
```

## 데이터 저장소

### AIT.SetStorageData()
로컬 스토리지에 데이터를 저장합니다.

```csharp
public static void SetStorageData(string key, string value, Action<BaseResult> callback = null)
```

### AIT.GetStorageData()
로컬 스토리지에서 데이터를 조회합니다.

```csharp
public static void GetStorageData(string key, Action<StorageDataResult> callback)
```

**예제:**
```csharp
// 데이터 저장
AIT.SetStorageData("highScore", "12500", (result) => {
    if (result.success) {
        Debug.Log("점수 저장 완료");
    }
});

// 데이터 조회
AIT.GetStorageData("highScore", (result) => {
    if (result.success) {
        int highScore = int.Parse(result.value);
        Debug.Log($"최고 점수: {highScore}");
    }
});
```

## 공유 기능

### AIT.ShareText()
텍스트를 공유합니다.

```csharp
public static void ShareText(ShareTextOptions options)
```

### AIT.ShareLink()
링크를 공유합니다.

```csharp
public static void ShareLink(ShareLinkOptions options)
```

**예제:**
```csharp
AIT.ShareLink(new ShareLinkOptions {
    url = "https://appsintoss.com/game/mygame",
    title = "내 게임 점수를 확인해보세요!",
    description = $"최고 점수 {highScore}점을 달성했습니다!",
    imageUrl = "https://example.com/game-screenshot.jpg",
    onComplete = (result) => Debug.Log("공유 완료"),
    onCancel = (result) => Debug.Log("공유 취소")
});
```

## 디바이스 기능

### AIT.Vibrate()
디바이스 진동을 재생합니다.

```csharp
public static void Vibrate(VibrationType type = VibrationType.Light)
```

### AIT.ShowToast()
토스트 메시지를 표시합니다.

```csharp
public static void ShowToast(ToastOptions options)
```

**예제:**
```csharp
AIT.ShowToast(new ToastOptions {
    message = "게임 저장 완료!",
    duration = ToastDuration.Short,
    position = ToastPosition.Bottom
});
```

### AIT.GetDeviceInfo()
디바이스 정보를 조회합니다.

```csharp
public static void GetDeviceInfo(Action<DeviceInfoResult> callback)
```

### AIT.GetLocation()
위치 정보를 조회합니다.

```csharp
public static void GetLocation(LocationOptions options)
```

**예제:**
```csharp
AIT.GetLocation(new LocationOptions {
    accuracy = LocationAccuracy.Best,
    timeout = 30000,
    onSuccess = (result) => {
        Debug.Log($"현재 위치: {result.latitude}, {result.longitude}");
    },
    onFailure = (error) => {
        Debug.LogError($"위치 조회 실패: {error.message}");
    }
});
```

## 분석 도구

### AIT.TrackEvent()
사용자 이벤트를 추적합니다.

```csharp
public static void TrackEvent(string eventName, Dictionary<string, object> parameters = null)
```

**예제:**
```csharp
AIT.TrackEvent("level_complete", new Dictionary<string, object> {
    ["level"] = 5,
    ["score"] = 1250,
    ["time"] = 45.2f
});
```

### AIT.SetUserProperties()
사용자 속성을 설정합니다.

```csharp
public static void SetUserProperties(Dictionary<string, object> properties)
```

**예제:**
```csharp
AIT.SetUserProperties(new Dictionary<string, object> {
    ["player_level"] = 15,
    ["preferred_game_mode"] = "endless",
    ["vip_status"] = true
});
```

## 데이터 구조

### BaseResult
모든 API 호출의 기본 결과 클래스입니다.

```csharp
public class BaseResult
{
    public bool success;        // 성공 여부
    public string message;      // 결과 메시지
    public int errorCode;       // 오류 코드 (성공 시 0)
}
```

### UserInfoResult
사용자 정보 결과입니다.

```csharp
public class UserInfoResult : BaseResult
{
    public string userId;       // 사용자 ID
    public string nickname;     // 닉네임
    public string profileImage; // 프로필 이미지 URL
    public string email;        // 이메일
    public string phone;        // 전화번호
}
```

### PaymentResult
결제 결과입니다.

```csharp
public class PaymentResult : BaseResult
{
    public string paymentKey;   // 결제 키
    public string orderId;      // 주문 ID
    public int amount;          // 결제 금액
    public string status;       // 결제 상태
    public string approvedAt;   // 결제 승인 시간
}
```

### AudioInfoResult
오디오 정보 결과입니다.

```csharp
public class AudioInfoResult : BaseResult
{
    public int audioId;         // 오디오 ID
    public AudioState state;    // 오디오 상태
    public float currentTime;   // 현재 재생 시간
    public float duration;      // 총 길이
    public float volume;        // 볼륨
    public bool loop;          // 반복 여부
    public float playbackRate; // 재생 속도
    public string src;         // 소스 URL
}
```

### FileStatsResult
파일 정보 결과입니다.

```csharp
public class FileStatsResult : BaseResult
{
    public FileStats stats;     // 파일 통계 정보
}

public class FileStats
{
    public string path;         // 파일 경로
    public long size;          // 파일 크기 (바이트)
    public long modifiedTime;  // 수정 시간 (타임스탬프)
    public bool isFile;        // 파일 여부
    public bool isDirectory;   // 디렉토리 여부
    public string type;        // 파일 타입
}
```

### PerformanceReportResult
성능 보고서 결과입니다.

```csharp
public class PerformanceReportResult : BaseResult
{
    public PerformanceReport report; // 성능 보고서
}

public class PerformanceReport
{
    public float timestamp;                         // 보고서 생성 시간
    public float uptime;                           // 앱 실행 시간
    public PerformanceMetrics metrics;             // 성능 메트릭
    public SystemInfo systemInfo;                  // 시스템 정보
    public PerformanceRecommendation[] recommendations; // 최적화 권장사항
}
```

### SensorData
센서 데이터 구조체들입니다.

```csharp
public class AccelerometerData
{
    public float x;            // X축 가속도
    public float y;            // Y축 가속도
    public float z;            // Z축 가속도
    public long timestamp;     // 타임스탬프
}

public class GyroscopeData
{
    public float x;            // X축 회전 (beta)
    public float y;            // Y축 회전 (gamma)
    public float z;            // Z축 회전 (alpha)
    public long timestamp;     // 타임스탬프
}
```

## 열거형

### VibrationType
진동 타입을 정의합니다.

```csharp
public enum VibrationType
{
    Light,      // 약한 진동
    Medium,     // 보통 진동
    Heavy       // 강한 진동
}
```

### NetworkType
네트워크 타입을 정의합니다.

```csharp
public enum NetworkType
{
    None,       // 연결 없음
    Wifi,       // WiFi
    Mobile2G,   // 2G 모바일
    Mobile3G,   // 3G 모바일
    Mobile4G,   // 4G 모바일
    Mobile5G,   // 5G 모바일
    Unknown     // 알 수 없음
}
```

### BannerAdPosition
배너 광고 위치를 정의합니다.

```csharp
public enum BannerAdPosition
{
    Top,        // 상단
    Bottom      // 하단
}
```

### AudioState
오디오 상태를 정의합니다.

```csharp
public enum AudioState
{
    Idle = 1,       // 대기
    Loading = 2,    // 로딩 중
    Playing = 3,    // 재생 중
    Paused = 4,     // 일시정지
    Stopped = 5,    // 정지
    Error = -1      // 오류
}
```

### SensorInterval
센서 데이터 수집 간격을 정의합니다.

```csharp
public enum SensorInterval
{
    UI,         // 60ms (16.7fps) - UI 업데이트용
    Game,       // 20ms (50fps) - 게임용
    Normal      // 200ms (5fps) - 일반용
}
```

### SensorType
센서 타입을 정의합니다.

```csharp
public enum SensorType
{
    Accelerometer,  // 가속도계
    Gyroscope,      // 자이로스코프
    Compass,        // 나침반
    DeviceMotion    // 기기 방향
}
```

## 오류 코드

| 코드 | 설명 |
|-----|------|
| 0 | 성공 |
| -1 | 일반적인 오류 |
| -2 | 권한 거부 |
| -3 | 기능 미지원 |
| 1001 | 네트워크 오류 |
| 1002 | 사용자 인증 실패 |
| 1003 | 결제 실패 |
| 1004 | 광고 로드 실패 |
| 1005 | 권한 거부 |
| 1006 | 데이터 저장 실패 |
| 2001 | 오디오 로딩 실패 |
| 2002 | 오디오 재생 실패 |
| 3001 | 파일을 찾을 수 없음 |
| 3002 | 파일 읽기 실패 |
| 3003 | 파일 쓰기 실패 |
| 3004 | 저장 공간 부족 |
| 4001 | 센서 미지원 |
| 4002 | 센서 권한 거부 |
| 4003 | 센서 초기화 실패 |
| 5001 | 성능 모니터링 초기화 실패 |

## 모범 사례

### 1. 초기화
```csharp
void Start()
{
    // 앱 시작 시 즉시 초기화
    AIT.Init((result) => {
        if (result.success) {
            // 초기화 성공 후 다른 기능 사용
            CheckUserLogin();
        }
    });
}
```

### 2. 오류 처리
```csharp
AIT.RequestPayment(new PaymentOptions {
    // ... 결제 옵션
    onFailure = (error) => {
        switch (error.errorCode) {
            case 1003:
                ShowErrorMessage("결제에 실패했습니다. 다시 시도해주세요.");
                break;
            default:
                ShowErrorMessage($"오류가 발생했습니다: {error.message}");
                break;
        }
    }
});
```

### 3. 리소스 정리
```csharp
void OnApplicationPause(bool pauseStatus)
{
    if (pauseStatus) {
        // 배너 광고 숨기기
        AIT.HideBannerAd();
        
        // 배경음악 일시정지
        AIT.PauseBackgroundMusic();
        
        // 모든 센서 중지
        AIT.StopAllSensors();
        
        // 성능 모니터링 중지
        AIT.StopPerformanceMonitoring();
    } else {
        // 앱이 다시 활성화될 때
        AIT.ResumeBackgroundMusic();
    }
}
```

### 4. 오디오 관리
```csharp
public class AudioManager : MonoBehaviour
{
    private int bgmAudioId = -1;
    private int sfxAudioId = -1;
    
    void Start()
    {
        // 배경음악 설정
        var bgmOptions = new AudioContextOptions {
            gameObject = gameObject.name,
            onCanPlay = "OnBGMCanPlay",
            onError = "OnBGMError"
        };
        
        bgmAudioId = AIT.CreateAudioContext(bgmOptions);
        AIT.SetAudioSource(bgmAudioId, "bgm.mp3");
        AIT.SetAudioLoop(bgmAudioId, true);
        AIT.SetAudioVolume(bgmAudioId, 0.7f);
    }
    
    void OnBGMCanPlay(string result)
    {
        AIT.PlayAudio(bgmAudioId);
    }
    
    void OnDestroy()
    {
        // 오디오 리소스 정리
        if (bgmAudioId != -1) {
            AIT.DestroyAudio(bgmAudioId);
        }
    }
}
```

### 5. 센서 데이터 활용
```csharp
public class MotionController : MonoBehaviour
{
    private bool isShaking = false;
    private float shakeThreshold = 15.0f;
    
    void Start()
    {
        // 센서 권한 확인
        AIT.CheckSensorPermissions(new SensorPermissionOptions {
            gameObject = gameObject.name,
            onSuccess = "OnSensorPermissionChecked"
        });
    }
    
    void OnSensorPermissionChecked(string result)
    {
        var permResult = JsonUtility.FromJson<SensorPermissionResult>(result);
        if (permResult.success && permResult.permissions.accelerometer) {
            StartAccelerometer();
        }
    }
    
    void StartAccelerometer()
    {
        AIT.StartAccelerometer(new AccelerometerOptions {
            interval = SensorInterval.Game,
            gameObject = gameObject.name,
            onSuccess = "OnAccelerometerStarted"
        });
        
        AIT.OnSensorChange(new SensorCallbackOptions {
            sensorType = SensorType.Accelerometer,
            gameObject = gameObject.name,
            callback = "OnAccelerometerData"
        });
    }
    
    void OnAccelerometerData(string dataJson)
    {
        var sensorData = JsonUtility.FromJson<SensorDataWrapper>(dataJson);
        var accelData = JsonUtility.FromJson<AccelerometerData>(sensorData.result);
        
        float magnitude = Mathf.Sqrt(accelData.x * accelData.x + 
                                    accelData.y * accelData.y + 
                                    accelData.z * accelData.z);
        
        if (magnitude > shakeThreshold && !isShaking) {
            isShaking = true;
            OnDeviceShake();
            
            // 0.5초 후 다시 감지 가능하도록
            Invoke("ResetShakeDetection", 0.5f);
        }
    }
    
    void OnDeviceShake()
    {
        Debug.Log("기기 흔들기 감지!");
        // 특수 이벤트 발생
        AIT.Vibrate(VibrationType.Medium);
    }
    
    void ResetShakeDetection()
    {
        isShaking = false;
    }
}
```

### 6. 성능 최적화
```csharp
public class PerformanceManager : MonoBehaviour
{
    void Start()
    {
        // 성능 모니터링 시작
        AIT.StartPerformanceMonitoring(new PerformanceMonitorOptions {
            interval = 5000, // 5초마다 수집
            gameObject = gameObject.name,
            onSuccess = "OnMonitoringStarted"
        });
        
        // 메모리 경고 리스너 등록
        AIT.OnMemoryWarning(new MemoryWarningOptions {
            gameObject = gameObject.name,
            onMemoryWarning = "OnMemoryWarning"
        });
    }
    
    void OnMemoryWarning(string resultJson)
    {
        var warning = JsonUtility.FromJson<MemoryWarningResult>(resultJson);
        Debug.LogWarning($"메모리 경고: {warning.level}");
        
        if (warning.level == "critical") {
            // 긴급 메모리 정리
            Resources.UnloadUnusedAssets();
            System.GC.Collect();
            
            // 불필요한 게임 오브젝트 비활성화
            DeactivateNonEssentialObjects();
        }
    }
    
    void DeactivateNonEssentialObjects()
    {
        // 화면에 보이지 않는 파티클 시스템 정지
        var particles = FindObjectsOfType<ParticleSystem>();
        foreach (var ps in particles) {
            if (!ps.GetComponent<Renderer>().isVisible) {
                ps.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
            }
        }
    }
}
```

### 7. 파일 시스템 활용
```csharp
public class SaveManager : MonoBehaviour
{
    void Start()
    {
        // 파일 시스템 초기화
        AIT.InitFileSystem(new FileSystemOptions {
            gameObject = gameObject.name,
            onInitCallback = "OnFileSystemInit"
        });
    }
    
    void OnFileSystemInit(string result)
    {
        var initResult = JsonUtility.FromJson<BaseResult>(result);
        if (initResult.success) {
            LoadGameData();
        }
    }
    
    public void SaveGameData(GameData data)
    {
        string jsonData = JsonUtility.ToJson(data);
        
        AIT.WriteFile(new WriteFileOptions {
            filePath = "/AppsInToss/userData/savegame.json",
            data = jsonData,
            gameObject = gameObject.name,
            onSuccess = "OnDataSaved",
            onFail = "OnDataSaveFailed"
        });
    }
    
    void LoadGameData()
    {
        AIT.ReadFile(new ReadFileOptions {
            filePath = "/AppsInToss/userData/savegame.json",
            gameObject = gameObject.name,
            onSuccess = "OnDataLoaded",
            onFail = "OnDataLoadFailed"
        });
    }
    
    void OnDataLoaded(string result)
    {
        var readResult = JsonUtility.FromJson<ReadFileResult>(result);
        if (readResult.success) {
            var gameData = JsonUtility.FromJson<GameData>(readResult.data);
            ApplyGameData(gameData);
        }
    }
    
    void OnDataLoadFailed(string result)
    {
        // 세이브 파일이 없는 경우 기본값으로 시작
        Debug.Log("세이브 파일 없음, 새 게임으로 시작");
        StartNewGame();
    }
}
```

## 업데이트 내용 (v2.0.0)

### 새로운 기능
- **오디오 시스템**: 다중 오디오 재생, 배경음악 관리, 볼륨/속도 제어
- **파일 시스템**: 로컬 파일 읽기/쓰기, 디렉토리 관리, 저장소 정보 조회
- **센서 시스템**: 가속도계, 자이로스코프, 나침반, 기기 방향 감지
- **성능 모니터링**: 실시간 FPS/메모리 추적, 성능 보고서, 최적화 권장사항

### API 개선사항
- 총 **70개 API**로 확장 (기존 35개 → 35개 추가)
- 위챗 미니프로그램 호환성 30% 수준 달성
- 통합된 콜백 시스템으로 일관성 향상
- 상세한 오류 코드 및 메시지 제공

### 성능 향상
- JavaScript-Unity 브릿지 최적화
- 메모리 사용량 모니터링 및 자동 정리
- 센서 데이터 수집 최적화 (인터벌 조절 가능)
- 배치 처리를 통한 콜백 성능 개선