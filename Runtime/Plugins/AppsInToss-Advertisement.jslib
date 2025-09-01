/**
 * Apps in Toss Advertisement Plugin for Unity WebGL
 * 광고 시스템 (배너, 전면, 보상형)
 */

var AppsInTossAdPlugin = {
    // 광고 상태 추적
    adStates: {},
    bannerAd: null,
    interstitialAd: null,
    rewardedAd: null,
    
    // 배너 광고 표시
    aitShowBannerAd: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Ad] Showing banner ad:', options);
        
        // 기존 배너 광고 제거
        if (AppsInTossAdPlugin.bannerAd) {
            AppsInTossAdPlugin.aitHideBannerAd();
        }
        
        // 배너 광고 엘리먼트 생성
        var bannerContainer = document.createElement('div');
        bannerContainer.id = 'ait-banner-ad';
        bannerContainer.style.cssText = [
            'position: fixed',
            'left: 0',
            'right: 0',
            'width: 100%',
            'height: 60px',
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'display: flex',
            'justify-content: center',
            'align-items: center',
            'color: white',
            'font-size: 14px',
            'font-weight: bold',
            'cursor: pointer',
            'z-index: 9000',
            'transition: all 0.3s ease',
            options.position === 'top' ? 'top: 0' : 'bottom: 0'
        ].join('; ');
        
        // 배너 내용
        var adContent = document.createElement('div');
        adContent.textContent = '🎮 Apps in Toss에서 더 많은 게임을 즐겨보세요!';
        bannerContainer.appendChild(adContent);
        
        // 닫기 버튼
        var closeButton = document.createElement('div');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = [
            'position: absolute',
            'right: 10px',
            'top: 50%',
            'transform: translateY(-50%)',
            'width: 20px',
            'height: 20px',
            'display: flex',
            'justify-content: center',
            'align-items: center',
            'background: rgba(0, 0, 0, 0.3)',
            'border-radius: 50%',
            'cursor: pointer',
            'font-size: 16px',
            'font-weight: bold'
        ].join('; ');
        
        closeButton.onclick = function(e) {
            e.stopPropagation();
            AppsInTossAdPlugin.aitHideBannerAd();
        };
        
        bannerContainer.appendChild(closeButton);
        
        // 클릭 이벤트
        bannerContainer.onclick = function() {
            console.log('[AIT Ad] Banner ad clicked');
            
            if (options.clickedCallback && options.gameObject) {
                var callbackData = {
                    callbackName: options.clickedCallback,
                    result: JSON.stringify({ clicked: true })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
            
            // 광고 클릭 시 새 창으로 Apps in Toss 열기
            window.open('https://appsintoss.com', '_blank');
        };
        
        // DOM에 추가
        document.body.appendChild(bannerContainer);
        AppsInTossAdPlugin.bannerAd = bannerContainer;
        
        // 로드 완료 콜백
        setTimeout(function() {
            if (options.loadedCallback && options.gameObject) {
                var result = {
                    success: true,
                    message: 'Banner ad loaded successfully'
                };
                var callbackData = {
                    callbackName: options.loadedCallback,
                    result: JSON.stringify(result)
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }, 100);
    },
    
    // 배너 광고 숨기기
    aitHideBannerAd: function() {
        console.log('[AIT Ad] Hiding banner ad');
        
        if (AppsInTossAdPlugin.bannerAd) {
            AppsInTossAdPlugin.bannerAd.style.opacity = '0';
            setTimeout(function() {
                if (AppsInTossAdPlugin.bannerAd && AppsInTossAdPlugin.bannerAd.parentNode) {
                    document.body.removeChild(AppsInTossAdPlugin.bannerAd);
                }
                AppsInTossAdPlugin.bannerAd = null;
            }, 300);
        }
    },
    
    // 전면 광고 표시
    aitShowInterstitialAd: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Ad] Showing interstitial ad:', options);
        
        // 전면 광고 오버레이 생성
        var overlay = document.createElement('div');
        overlay.id = 'ait-interstitial-ad';
        overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'right: 0',
            'bottom: 0',
            'background: rgba(0, 0, 0, 0.9)',
            'display: flex',
            'flex-direction: column',
            'justify-content: center',
            'align-items: center',
            'z-index: 10000',
            'opacity: 0',
            'transition: opacity 0.5s ease'
        ].join('; ');
        
        // 광고 내용 컨테이너
        var adContainer = document.createElement('div');
        adContainer.style.cssText = [
            'background: white',
            'border-radius: 20px',
            'padding: 40px',
            'max-width: 400px',
            'width: 90%',
            'text-align: center',
            'position: relative'
        ].join('; ');
        
        // 광고 제목
        var title = document.createElement('h2');
        title.textContent = 'Apps in Toss';
        title.style.cssText = [
            'color: #333',
            'margin: 0 0 20px 0',
            'font-size: 24px',
            'font-weight: bold'
        ].join('; ');
        adContainer.appendChild(title);
        
        // 광고 내용
        var content = document.createElement('p');
        content.textContent = '더 많은 재미있는 게임들을 Apps in Toss에서 만나보세요!';
        content.style.cssText = [
            'color: #666',
            'margin: 0 0 30px 0',
            'font-size: 16px',
            'line-height: 1.5'
        ].join('; ');
        adContainer.appendChild(content);
        
        // 버튼 컨테이너
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = [
            'display: flex',
            'gap: 15px',
            'justify-content: center'
        ].join('; ');
        
        // 앱 다운로드 버튼
        var downloadButton = document.createElement('button');
        downloadButton.textContent = '앱 다운로드';
        downloadButton.style.cssText = [
            'background: #3182ce',
            'color: white',
            'border: none',
            'border-radius: 10px',
            'padding: 12px 24px',
            'font-size: 14px',
            'font-weight: bold',
            'cursor: pointer',
            'transition: all 0.2s'
        ].join('; ');
        
        downloadButton.onclick = function() {
            console.log('[AIT Ad] Interstitial ad clicked');
            
            if (options.clickedCallback && options.gameObject) {
                var callbackData = {
                    callbackName: options.clickedCallback,
                    result: JSON.stringify({ clicked: true })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
            
            window.open('https://appsintoss.com/download', '_blank');
        };
        
        buttonContainer.appendChild(downloadButton);
        
        // 닫기 버튼
        var closeButton = document.createElement('button');
        closeButton.textContent = '닫기';
        closeButton.style.cssText = [
            'background: #e2e8f0',
            'color: #4a5568',
            'border: none',
            'border-radius: 10px',
            'padding: 12px 24px',
            'font-size: 14px',
            'font-weight: bold',
            'cursor: pointer',
            'transition: all 0.2s'
        ].join('; ');
        
        closeButton.onclick = function() {
            AppsInTossAdPlugin.hideInterstitialAd(overlay, options);
        };
        
        buttonContainer.appendChild(closeButton);
        adContainer.appendChild(buttonContainer);
        
        // 상단 X 버튼
        var xButton = document.createElement('div');
        xButton.innerHTML = '×';
        xButton.style.cssText = [
            'position: absolute',
            'top: 15px',
            'right: 20px',
            'width: 30px',
            'height: 30px',
            'display: flex',
            'justify-content: center',
            'align-items: center',
            'background: #f0f0f0',
            'border-radius: 50%',
            'cursor: pointer',
            'font-size: 20px',
            'font-weight: bold',
            'color: #666'
        ].join('; ');
        
        xButton.onclick = function() {
            AppsInTossAdPlugin.hideInterstitialAd(overlay, options);
        };
        
        adContainer.appendChild(xButton);
        overlay.appendChild(adContainer);
        
        // DOM에 추가 및 애니메이션
        document.body.appendChild(overlay);
        AppsInTossAdPlugin.interstitialAd = overlay;
        
        setTimeout(function() {
            overlay.style.opacity = '1';
            
            // 로드 완료 콜백
            if (options.loadedCallback && options.gameObject) {
                var result = {
                    success: true,
                    message: 'Interstitial ad loaded successfully'
                };
                var callbackData = {
                    callbackName: options.loadedCallback,
                    result: JSON.stringify(result)
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
            
            // 표시 콜백
            if (options.shownCallback && options.gameObject) {
                var callbackData = {
                    callbackName: options.shownCallback,
                    result: JSON.stringify({ shown: true })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }, 100);
    },
    
    // 전면 광고 숨기기
    hideInterstitialAd: function(overlay, options) {
        console.log('[AIT Ad] Hiding interstitial ad');
        
        overlay.style.opacity = '0';
        setTimeout(function() {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
            AppsInTossAdPlugin.interstitialAd = null;
            
            // 닫힘 콜백
            if (options.closedCallback && options.gameObject) {
                var callbackData = {
                    callbackName: options.closedCallback,
                    result: JSON.stringify({ closed: true })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }, 500);
    },
    
    // 보상형 광고 표시
    aitShowRewardedAd: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Ad] Showing rewarded ad:', options);
        
        // 보상형 광고 오버레이 생성
        var overlay = document.createElement('div');
        overlay.id = 'ait-rewarded-ad';
        overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'right: 0',
            'bottom: 0',
            'background: rgba(0, 0, 0, 0.95)',
            'display: flex',
            'flex-direction: column',
            'justify-content: center',
            'align-items: center',
            'z-index: 10001',
            'opacity: 0',
            'transition: opacity 0.5s ease'
        ].join('; ');
        
        // 광고 내용 컨테이너
        var adContainer = document.createElement('div');
        adContainer.style.cssText = [
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'border-radius: 20px',
            'padding: 40px',
            'max-width: 400px',
            'width: 90%',
            'text-align: center',
            'color: white',
            'position: relative'
        ].join('; ');
        
        // 보상 아이콘
        var rewardIcon = document.createElement('div');
        rewardIcon.innerHTML = '💎';
        rewardIcon.style.cssText = [
            'font-size: 48px',
            'margin-bottom: 20px'
        ].join('; ');
        adContainer.appendChild(rewardIcon);
        
        // 광고 제목
        var title = document.createElement('h2');
        title.textContent = '보상을 받으세요!';
        title.style.cssText = [
            'color: white',
            'margin: 0 0 10px 0',
            'font-size: 24px',
            'font-weight: bold'
        ].join('; ');
        adContainer.appendChild(title);
        
        // 광고 내용
        var content = document.createElement('p');
        content.textContent = '광고를 시청하고 게임 내 보상을 획득하세요!';
        content.style.cssText = [
            'color: rgba(255, 255, 255, 0.9)',
            'margin: 0 0 30px 0',
            'font-size: 16px',
            'line-height: 1.5'
        ].join('; ');
        adContainer.appendChild(content);
        
        // 진행 표시
        var progressContainer = document.createElement('div');
        progressContainer.style.cssText = [
            'margin-bottom: 30px'
        ].join('; ');
        
        var progressText = document.createElement('div');
        progressText.textContent = '광고 시청 중... 5초';
        progressText.style.cssText = [
            'color: white',
            'font-size: 14px',
            'margin-bottom: 10px'
        ].join('; ');
        progressContainer.appendChild(progressText);
        
        var progressBar = document.createElement('div');
        progressBar.style.cssText = [
            'width: 100%',
            'height: 6px',
            'background: rgba(255, 255, 255, 0.3)',
            'border-radius: 3px',
            'overflow: hidden'
        ].join('; ');
        
        var progressFill = document.createElement('div');
        progressFill.style.cssText = [
            'width: 0%',
            'height: 100%',
            'background: white',
            'border-radius: 3px',
            'transition: width 0.1s ease'
        ].join('; ');
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        adContainer.appendChild(progressContainer);
        
        // 버튼 컨테이너
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = [
            'display: flex',
            'gap: 15px',
            'justify-content: center'
        ].join('; ');
        
        // 보상 받기 버튼 (처음에는 숨김)
        var rewardButton = document.createElement('button');
        rewardButton.textContent = '보상 받기';
        rewardButton.style.cssText = [
            'background: #48bb78',
            'color: white',
            'border: none',
            'border-radius: 10px',
            'padding: 12px 24px',
            'font-size: 14px',
            'font-weight: bold',
            'cursor: pointer',
            'transition: all 0.2s',
            'display: none'
        ].join('; ');
        
        rewardButton.onclick = function() {
            console.log('[AIT Ad] Rewarded ad completed, giving reward');
            
            // 보상 지급 콜백
            if (options.rewardedCallback && options.gameObject) {
                var rewardResult = {
                    success: true,
                    rewardType: 'coins',
                    rewardAmount: 100
                };
                var callbackData = {
                    callbackName: options.rewardedCallback,
                    result: JSON.stringify(rewardResult)
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
            
            AppsInTossAdPlugin.hideRewardedAd(overlay, options);
        };
        
        buttonContainer.appendChild(rewardButton);
        
        // 닫기 버튼
        var closeButton = document.createElement('button');
        closeButton.textContent = '닫기';
        closeButton.style.cssText = [
            'background: rgba(255, 255, 255, 0.2)',
            'color: white',
            'border: none',
            'border-radius: 10px',
            'padding: 12px 24px',
            'font-size: 14px',
            'font-weight: bold',
            'cursor: pointer',
            'transition: all 0.2s'
        ].join('; ');
        
        closeButton.onclick = function() {
            AppsInTossAdPlugin.hideRewardedAd(overlay, options);
        };
        
        buttonContainer.appendChild(closeButton);
        adContainer.appendChild(buttonContainer);
        overlay.appendChild(adContainer);
        
        // DOM에 추가 및 애니메이션
        document.body.appendChild(overlay);
        AppsInTossAdPlugin.rewardedAd = overlay;
        
        setTimeout(function() {
            overlay.style.opacity = '1';
            
            // 로드 완료 콜백
            if (options.loadedCallback && options.gameObject) {
                var result = {
                    success: true,
                    message: 'Rewarded ad loaded successfully'
                };
                var callbackData = {
                    callbackName: options.loadedCallback,
                    result: JSON.stringify(result)
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
            
            // 표시 콜백
            if (options.shownCallback && options.gameObject) {
                var callbackData = {
                    callbackName: options.shownCallback,
                    result: JSON.stringify({ shown: true })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
            
            // 광고 진행 시뮬레이션 (5초)
            var timeLeft = 5;
            var interval = setInterval(function() {
                timeLeft--;
                progressFill.style.width = ((5 - timeLeft) / 5 * 100) + '%';
                progressText.textContent = timeLeft > 0 ? '광고 시청 중... ' + timeLeft + '초' : '광고 시청 완료!';
                
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    progressContainer.style.display = 'none';
                    rewardButton.style.display = 'block';
                }
            }, 1000);
        }, 100);
    },
    
    // 보상형 광고 숨기기
    hideRewardedAd: function(overlay, options) {
        console.log('[AIT Ad] Hiding rewarded ad');
        
        overlay.style.opacity = '0';
        setTimeout(function() {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
            AppsInTossAdPlugin.rewardedAd = null;
            
            // 닫힘 콜백
            if (options.closedCallback && options.gameObject) {
                var callbackData = {
                    callbackName: options.closedCallback,
                    result: JSON.stringify({ closed: true })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }, 500);
    },
    
    // 광고 가용성 확인
    aitIsAdAvailable: function(adTypePtr) {
        var adType = UTF8ToString(adTypePtr);
        console.log('[AIT Ad] Checking ad availability for:', adType);
        
        // 개발 환경에서는 항상 사용 가능
        return 1;
    },
    
    // 광고 로딩 상태 확인
    aitGetAdLoadingState: function(adTypePtr) {
        var adType = UTF8ToString(adTypePtr);
        console.log('[AIT Ad] Getting ad loading state for:', adType);
        
        // 개발 환경에서는 항상 로드됨
        return 1; // 1 = loaded, 0 = loading, -1 = failed
    }
};

// Unity에서 사용할 수 있도록 함수들을 전역에 등록
mergeInto(LibraryManager.library, AppsInTossAdPlugin);