# Apps in Toss Unity SDK 시작 가이드

## 개요

Apps in Toss Unity SDK를 사용하면 Unity로 제작한 게임을 Apps in Toss 플랫폼의 미니앱으로 쉽게 변환할 수 있습니다. 이 가이드는 SDK 설치부터 첫 번째 미니앱 배포까지의 전체 과정을 안내합니다.

## 시스템 요구사항

### Unity 버전
- Unity 2019.4 LTS 이상
- Tuanjie Engine 지원

### 플랫폼
- WebGL 빌드 지원
- Windows, macOS, Linux 개발 환경

### 브라우저
- Chrome 80+
- Safari 13+
- Firefox 75+
- Edge 80+

## 설치

### 1. Package Manager를 통한 설치

1. Unity Editor를 열고 프로젝트를 생성하거나 엽니다.
2. `Window` → `Package Manager`를 선택합니다.
3. 좌상단의 `+` 버튼을 클릭합니다.
4. `Add package from git URL...`을 선택합니다.
5. 다음 URL을 입력합니다:
   ```
   https://github.com/appsintoss/apps-in-toss-unity-transform-sdk.git
   ```
6. `Add` 버튼을 클릭합니다.

### 2. 수동 설치

1. [릴리즈 페이지](https://github.com/appsintoss/apps-in-toss-unity-transform-sdk/releases)에서 최신 버전을 다운로드합니다.
2. Unity 프로젝트의 `Assets` 폴더에 압축을 해제합니다.
3. Unity Editor에서 자동으로 임포트됩니다.

## 프로젝트 설정

### 1. 플랫폼 설정

1. `File` → `Build Settings`를 엽니다.
2. `Platform`에서 `WebGL`을 선택합니다.
3. `Switch Platform`을 클릭합니다.

### 2. Apps in Toss 설정

1. Unity Editor에서 `Apps in Toss` → `미니앱 변환` 메뉴를 클릭합니다.
2. 설정 패널에서 필요한 정보를 입력합니다:
   - **앱 ID**: Apps in Toss 개발자 콘솔에서 발급받은 앱 ID
   - **앱 이름**: 미니앱에 표시될 이름
   - **버전**: 앱 버전 (예: 1.0.0)
   - **설명**: 앱 설명

### 3. 토스페이 설정 (결제 사용 시)

1. [토스페이먼츠 개발자 센터](https://developers.tosspayments.com)에서 가맹점 등록
2. 설정 패널에서 토스페이 정보를 입력:
   - **가맹점 ID**: 토스페이먼츠에서 발급받은 가맹점 ID
   - **클라이언트 키**: 토스페이먼츠 클라이언트 키

### 4. 광고 설정 (광고 사용 시)

1. Apps in Toss 개발자 콘솔에서 광고 승인 신청
2. 설정 패널에서 광고 정보를 입력:
   - **배너 광고 ID**: 배너 광고 유닛 ID
   - **전면 광고 ID**: 전면 광고 유닛 ID
   - **보상형 광고 ID**: 보상형 광고 유닛 ID

## 첫 번째 앱 만들기

### 1. 기본 코드 작성

`GameManager.cs` 파일을 생성하고 다음 코드를 작성합니다:

```csharp
using UnityEngine;
using AppsInToss;

public class GameManager : MonoBehaviour
{
    void Start()
    {
        // Apps in Toss SDK 초기화
        AIT.Init((result) => {
            if (result.success) {
                Debug.Log("Apps in Toss SDK 초기화 성공!");
                CheckLoginStatus();
            } else {
                Debug.LogError($"SDK 초기화 실패: {result.message}");
            }
        });
    }
    
    void CheckLoginStatus()
    {
        AIT.CheckLoginStatus((result) => {
            if (result.success && result.isLoggedIn) {
                Debug.Log($"사용자 로그인됨: {result.userId}");
                LoadUserData();
            } else {
                Debug.Log("사용자가 로그인하지 않음");
                ShowLoginButton();
            }
        });
    }
    
    void ShowLoginButton()
    {
        // UI에 로그인 버튼 표시
        // 버튼 클릭 시 Login() 메서드 호출
    }
    
    public void Login()
    {
        AIT.Login(new LoginOptions {
            requestUserInfo = true,
            onSuccess = (userInfo) => {
                Debug.Log($"로그인 성공: {userInfo.nickname}");
                LoadUserData();
            },
            onFailure = (error) => {
                Debug.LogError($"로그인 실패: {error.message}");
            }
        });
    }
    
    void LoadUserData()
    {
        // 사용자 데이터 로드 로직
        AIT.GetStorageData("playerLevel", (result) => {
            if (result.success && !string.IsNullOrEmpty(result.value)) {
                int level = int.Parse(result.value);
                Debug.Log($"플레이어 레벨: {level}");
            } else {
                Debug.Log("새로운 플레이어");
                // 기본 데이터 설정
                AIT.SetStorageData("playerLevel", "1");
            }
        });
    }
}
```

### 2. UI 구성

1. Canvas를 생성합니다.
2. 로그인 버튼, 게임 UI 등을 추가합니다.
3. GameManager 스크립트를 빈 GameObject에 추가합니다.

### 3. 게임 로직 구현

기본적인 게임 로직을 구현하고 Apps in Toss SDK 기능을 활용합니다:

```csharp
public class GameController : MonoBehaviour
{
    public int score = 0;
    public int level = 1;
    
    void Start()
    {
        // 게임 시작 이벤트 추적
        AIT.TrackEvent("game_start", new Dictionary<string, object> {
            ["level"] = level,
            ["game_mode"] = "normal"
        });
    }
    
    public void AddScore(int points)
    {
        score += points;
        
        // 점수 달성 이벤트 추적
        if (score % 1000 == 0) {
            AIT.TrackEvent("score_milestone", new Dictionary<string, object> {
                ["score"] = score,
                ["level"] = level
            });
        }
    }
    
    public void CompleteLevel()
    {
        // 레벨 완료 이벤트 추적
        AIT.TrackEvent("level_complete", new Dictionary<string, object> {
            ["level"] = level,
            ["score"] = score,
            ["success"] = true
        });
        
        // 보상형 광고 표시 (선택사항)
        ShowRewardedAd();
        
        level++;
        SaveGameData();
    }
    
    void ShowRewardedAd()
    {
        AIT.ShowRewardedAd(new RewardedAdOptions {
            adUnitId = "your_rewarded_ad_id",
            onRewarded = (reward) => {
                Debug.Log($"보상 획득: {reward.rewardAmount}");
                // 보상 지급 로직
                GiveReward(reward.rewardAmount);
            }
        });
    }
    
    void SaveGameData()
    {
        AIT.SetStorageData("playerLevel", level.ToString());
        AIT.SetStorageData("playerScore", score.ToString());
    }
}
```

## 빌드 및 테스트

### 1. WebGL 빌드

1. `Apps in Toss` → `미니앱 변환` 메뉴를 엽니다.
2. 설정을 확인하고 `미니앱으로 변환` 버튼을 클릭합니다.
3. 빌드가 완료되면 `miniapp` 폴더가 생성됩니다.

### 2. 로컬 테스트

1. 웹 서버를 실행하여 빌드 결과를 테스트합니다:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

2. 브라우저에서 `http://localhost:8000/miniapp`에 접속하여 테스트합니다.

### 3. 개발자 도구 테스트

1. Apps in Toss 개발자 콘솔에 로그인합니다.
2. 프로젝트를 생성하고 미니앱 파일을 업로드합니다.
3. 시뮬레이터에서 테스트합니다.

## 배포

### 1. 앱 검토 준비

- 앱 스크린샷 준비
- 앱 설명 작성
- 개인정보 처리방침 작성 (필요시)
- 이용약관 작성 (필요시)

### 2. 앱 제출

1. Apps in Toss 개발자 콘솔에서 "배포 신청"을 클릭합니다.
2. 필요한 정보를 입력하고 파일을 업로드합니다.
3. 검토 요청을 제출합니다.

### 3. 검토 및 배포

- 검토는 일반적으로 3-7영업일이 소요됩니다.
- 검토 완료 후 앱이 Apps in Toss에 배포됩니다.

## 주요 기능 활용

### 결제 구현

```csharp
public void PurchaseItem(string itemId, int price)
{
    AIT.RequestPayment(new PaymentOptions {
        amount = price,
        productName = "게임 아이템",
        productId = itemId,
        orderId = "order_" + System.DateTime.Now.Ticks,
        customerKey = GetCurrentUserId(),
        onSuccess = (result) => {
            Debug.Log("결제 성공!");
            GiveItemToPlayer(itemId);
            AIT.TrackEvent("purchase", new Dictionary<string, object> {
                ["item_id"] = itemId,
                ["amount"] = price
            });
        },
        onFailure = (error) => {
            Debug.LogError($"결제 실패: {error.message}");
            ShowErrorDialog("결제에 실패했습니다.");
        }
    });
}
```

### 공유 기능

```csharp
public void ShareScore()
{
    AIT.ShareText(new ShareTextOptions {
        text = $"내가 {score}점을 달성했어요! 여러분도 도전해보세요!",
        title = "게임 점수 공유",
        onComplete = (result) => {
            Debug.Log("공유 완료");
            AIT.TrackEvent("share", new Dictionary<string, object> {
                ["type"] = "score",
                ["score"] = score
            });
        }
    });
}
```

### 분석 활용

```csharp
public void TrackUserBehavior()
{
    // 사용자 속성 설정
    AIT.SetUserProperties(new Dictionary<string, object> {
        ["player_level"] = level,
        ["total_playtime"] = GetTotalPlaytime(),
        ["favorite_character"] = GetFavoriteCharacter()
    });
    
    // 커스텀 이벤트 추적
    AIT.TrackEvent("button_click", new Dictionary<string, object> {
        ["button_name"] = "upgrade_weapon",
        ["screen"] = "shop"
    });
}
```

## 문제 해결

### 자주 발생하는 문제

1. **SDK 초기화 실패**
   - 인터넷 연결 확인
   - 앱 ID가 올바른지 확인
   - 브라우저 콘솔에서 오류 메시지 확인

2. **결제 실패**
   - 토스페이먼츠 설정 확인
   - 가맹점 ID와 클라이언트 키 확인
   - 테스트 환경에서 실제 결제 시도 금지

3. **빌드 오류**
   - Unity 버전 확인
   - WebGL 플랫폼 설정 확인
   - 콘솔 오류 메시지 확인

### 로그 확인

```csharp
// 디버그 모드 활성화 (개발 중에만)
#if DEVELOPMENT_BUILD || UNITY_EDITOR
    Debug.unityLogger.logEnabled = true;
#else
    Debug.unityLogger.logEnabled = false;
#endif
```

## 다음 단계

- [API 참조 문서](API-Reference.md) 확인
- [고급 기능 가이드](Advanced-Features.md) 학습
- [샘플 프로젝트](../Samples/) 참고
- [커뮤니티](https://community.appsintoss.com) 참여

## 지원

문제가 발생하거나 질문이 있으시면 다음 채널을 이용해주세요:

- 📧 이메일: dev@appsintoss.com
- 💬 커뮤니티: https://community.appsintoss.com
- 📖 문서: https://docs.appsintoss.com
- 🐛 버그 리포트: https://github.com/appsintoss/apps-in-toss-unity-transform-sdk/issues