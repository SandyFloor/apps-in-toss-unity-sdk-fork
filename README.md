# Apps in Toss 미니앱 Unity SDK

Apps in Toss 플랫폼을 위한 Unity/Tuanjie 엔진 SDK입니다.

## 설치 가이드

Unity 엔진 또는 [Tuanjie 엔진](https://unity.cn/tuanjie/tuanjieyinqing)으로 게임 프로젝트를 생성/열기한 후,
Unity Editor 메뉴바에서 `Window` - `Package Manager` - `오른쪽 상단 + 버튼` - `Add package from git URL...`을 클릭하여 본 저장소 Git 리소스 주소를 입력하면 됩니다.

예: `https://github.com/appsintoss/apps-in-toss-unity-transform-sdk.git`

## 주요 기능

### 🚀 핵심 기능
- **플랫폼 연동**: Apps in Toss 플랫폼과 완벽한 연동
- **웹GL 최적화**: Apps in Toss 환경에 최적화된 WebGL 빌드
- **자동 변환**: Unity 프로젝트를 Apps in Toss 미니앱으로 자동 변환
- **성능 최적화**: 모바일 환경에 최적화된 성능 튜닝

### 💰 결제 시스템
- **토스 페이 연동**: 토스페이를 통한 간편 결제
- **인앱 결제**: 게임 아이템 및 프리미엄 기능 결제
- **결제 검증**: 서버 측 결제 검증 지원

### 📱 광고 시스템
- **배너 광고**: 게임 화면에 배너 광고 표시
- **전면 광고**: 레벨 완료 후 전면 광고 표시
- **보상형 광고**: 게임 아이템 지급을 위한 보상형 광고

### 🔐 사용자 인증
- **토스 로그인**: 토스 계정을 통한 간편 로그인
- **사용자 정보**: 기본 사용자 정보 조회
- **권한 관리**: 필요한 권한만 요청하는 최소 권한 정책

### 📊 분석 도구
- **게임 분석**: 플레이어 행동 분석 및 통계
- **성능 모니터링**: 실시간 성능 지표 모니터링
- **오류 추적**: 자동 오류 보고 및 추적

## 시작하기

### 1. SDK 설치
```bash
# Package Manager를 통한 설치
https://github.com/appsintoss/apps-in-toss-unity-transform-sdk.git
```

### 2. 기본 설정
Unity Editor에서 `Apps in Toss` 메뉴를 클릭하여 설정 패널을 열고:
- 앱 ID 입력
- 빌드 설정 구성
- 플랫폼 특화 설정 조정

### 3. 게임 변환
```csharp
// C# 코드에서 SDK 사용 예제
using AppsInToss;

public class GameManager : MonoBehaviour 
{
    void Start() 
    {
        // Apps in Toss 플랫폼 초기화
        AIT.Init();
        
        // 사용자 로그인 확인
        AIT.CheckLoginStatus();
    }
}
```

### 4. 빌드 및 배포
1. `Apps in Toss / 미니앱 변환` 메뉴 클릭
2. 설정 확인 후 빌드 실행
3. 생성된 미니앱 파일을 Apps in Toss 개발자 콘솔에 업로드

## 사용 예제

### 결제 연동
```csharp
// 토스페이 결제 요청
AIT.Payment.RequestPayment(new PaymentRequest 
{
    amount = 1000,
    productName = "게임 아이템",
    onSuccess = (result) => Debug.Log("결제 성공"),
    onFailure = (error) => Debug.Log("결제 실패: " + error)
});
```

### 광고 표시
```csharp
// 보상형 광고 표시
AIT.Advertisement.ShowRewardedAd(new RewardedAdRequest 
{
    onRewarded = () => Debug.Log("보상 지급"),
    onClosed = () => Debug.Log("광고 닫힘")
});
```

### 사용자 정보
```csharp
// 사용자 정보 조회
AIT.User.GetUserInfo((userInfo) => 
{
    Debug.Log($"사용자 ID: {userInfo.userId}");
    Debug.Log($"닉네임: {userInfo.nickname}");
});
```

## API 문서

자세한 API 문서는 [개발자 가이드](https://docs.appsintoss.com/unity-sdk)를 참조하세요.

## 지원 Unity 버전

- Unity 2019.4 LTS 이상
- Tuanjie Engine 지원

## 자주 묻는 질문

### Q1. 게임 프로젝트는 빌드되지만 Apps in Toss 앱에서 실행 시 오류가 발생합니다
일반적으로 빈 프로젝트이거나 게임 코드에서 Apps in Toss SDK를 사용하지 않을 때 발생합니다. 
해결책: 게임의 적절한 위치에서 `AIT.Init()` 호출을 추가하세요.

### Q2. 결제 기능이 작동하지 않습니다
토스페이 연동을 위해서는 별도의 가맹점 등록이 필요합니다. 
[토스페이 개발자 센터](https://developers.tosspayments.com)에서 등록 후 SDK에 설정하세요.

### Q3. 광고가 표시되지 않습니다
광고 표시를 위해서는 Apps in Toss 광고 플랫폼 승인이 필요합니다.
개발자 콘솔에서 광고 승인 상태를 확인하세요.

## 라이센스

MIT License. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 지원

- 📧 이메일: appsintoss@toss.im
- 📞 전화: 02-1234-5678
- 💬 개발자 커뮤니티: [https://devtalk-apps-in-toss.toss.im](https://devtalk-apps-in-toss.toss.im)
- 📖 문서: [https://developers-apps-in-toss.toss.im](https://developers-apps-in-toss.toss.im)

## 업데이트 로그

### v1.0.0 (2025-09-01)
- 최초 릴리스
- 기본 플랫폼 연동 기능
- 토스페이 결제 연동
- 광고 시스템 통합
- 사용자 인증 시스템