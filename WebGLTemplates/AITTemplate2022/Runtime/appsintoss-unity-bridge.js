/**
 * Apps in Toss Unity Bridge
 * Unity WebGL과 Apps in Toss 플랫폼 간의 브릿지 역할
 */

window.AppsInTossUnityBridge = (function() {
    'use strict';
    
    var unityInstance = null;
    var debugMode = true;
    
    function log(message, data) {
        if (debugMode) {
            console.log('[AppsInToss Unity Bridge]', message, data || '');
        }
    }
    
    function error(message, data) {
        console.error('[AppsInToss Unity Bridge]', message, data || '');
    }
    
    // Unity에 메시지 전송
    function sendMessageToUnity(gameObject, method, data) {
        if (!unityInstance) {
            error('Unity instance is not initialized');
            return;
        }
        
        try {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            unityInstance.SendMessage(gameObject, method, data || '');
            log('Message sent to Unity:', { gameObject: gameObject, method: method, data: data });
        } catch (e) {
            error('Failed to send message to Unity:', e);
        }
    }
    
    // 결과를 Unity로 전송하는 헬퍼
    function sendCallbackToUnity(gameObject, callbackName, result) {
        var callbackData = {
            callbackName: callbackName,
            result: JSON.stringify(result)
        };
        sendMessageToUnity(gameObject, 'OnAITCallback', callbackData);
    }
    
    // Apps in Toss SDK 초기화
    function aitInit(gameObject, callback) {
        log('Initializing Apps in Toss SDK...');
        
        var result = {
            success: true,
            message: 'SDK initialized successfully',
            sdkVersion: '1.0.0',
            platformVersion: '1.0.0'
        };
        
        if (callback) {
            sendCallbackToUnity(gameObject, callback, result);
        }
    }
    
    // 로그인 상태 확인
    function aitCheckLoginStatus(gameObject, callback) {
        log('Checking login status...');
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.user) {
            AppsInTossSDK.user.getLoginStatus(function(status) {
                var result = {
                    success: true,
                    isLoggedIn: status.isLoggedIn,
                    userId: status.userId || ''
                };
                if (callback) {
                    sendCallbackToUnity(gameObject, callback, result);
                }
            });
        } else {
            var result = {
                success: true,
                isLoggedIn: false,
                userId: ''
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 로그인
    function aitLogin(options) {
        log('Attempting login...', options);
        
        var opts = JSON.parse(options);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.user) {
            AppsInTossSDK.user.login({
                requestUserInfo: opts.requestUserInfo,
                success: function(userInfo) {
                    var result = {
                        success: true,
                        userId: userInfo.userId,
                        nickname: userInfo.nickname,
                        profileImage: userInfo.profileImage,
                        email: userInfo.email,
                        phone: userInfo.phone
                    };
                    if (opts.successCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.successCallback, result);
                    }
                },
                failure: function(error) {
                    var result = {
                        success: false,
                        message: error.message || 'Login failed',
                        errorCode: error.code || -1
                    };
                    if (opts.failureCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.failureCallback, result);
                    }
                }
            });
        } else {
            // 가짜 로그인 성공
            var result = {
                success: true,
                userId: 'test_user_123',
                nickname: 'Test User',
                profileImage: '',
                email: 'test@appsintoss.com',
                phone: ''
            };
            if (opts.successCallback) {
                sendCallbackToUnity(opts.gameObject, opts.successCallback, result);
            }
        }
    }
    
    // 로그아웃
    function aitLogout(gameObject, callback) {
        log('Attempting logout...');
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.user) {
            AppsInTossSDK.user.logout({
                success: function() {
                    var result = { success: true, message: 'Logout successful' };
                    if (callback) {
                        sendCallbackToUnity(gameObject, callback, result);
                    }
                },
                failure: function(error) {
                    var result = {
                        success: false,
                        message: error.message || 'Logout failed',
                        errorCode: error.code || -1
                    };
                    if (callback) {
                        sendCallbackToUnity(gameObject, callback, result);
                    }
                }
            });
        } else {
            var result = { success: true, message: 'Logout successful' };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 사용자 정보 조회
    function aitGetUserInfo(gameObject, callback) {
        log('Getting user info...');
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.user) {
            AppsInTossSDK.user.getUserInfo({
                success: function(userInfo) {
                    var result = {
                        success: true,
                        userId: userInfo.userId,
                        nickname: userInfo.nickname,
                        profileImage: userInfo.profileImage,
                        email: userInfo.email,
                        phone: userInfo.phone
                    };
                    if (callback) {
                        sendCallbackToUnity(gameObject, callback, result);
                    }
                },
                failure: function(error) {
                    var result = {
                        success: false,
                        message: error.message || 'Failed to get user info',
                        errorCode: error.code || -1
                    };
                    if (callback) {
                        sendCallbackToUnity(gameObject, callback, result);
                    }
                }
            });
        } else {
            var result = {
                success: true,
                userId: 'test_user_123',
                nickname: 'Test User',
                profileImage: '',
                email: 'test@appsintoss.com',
                phone: ''
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 토스페이 결제
    function aitRequestPayment(options) {
        log('Requesting payment...', options);
        
        var opts = JSON.parse(options);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.payment) {
            AppsInTossSDK.payment.requestPayment({
                amount: opts.amount,
                orderId: opts.orderId,
                orderName: opts.productName,
                customerKey: opts.customerKey,
                successUrl: window.location.origin + '/payment/success',
                failUrl: window.location.origin + '/payment/fail'
            }).then(function(result) {
                var paymentResult = {
                    success: true,
                    paymentKey: result.paymentKey,
                    orderId: result.orderId,
                    amount: result.amount,
                    status: result.status,
                    approvedAt: result.approvedAt
                };
                if (opts.successCallback) {
                    sendCallbackToUnity(opts.gameObject, opts.successCallback, paymentResult);
                }
            }).catch(function(error) {
                if (error.code === 'USER_CANCEL') {
                    if (opts.cancelCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.cancelCallback, {});
                    }
                } else {
                    var result = {
                        success: false,
                        message: error.message || 'Payment failed',
                        errorCode: error.code || -1
                    };
                    if (opts.failureCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.failureCallback, result);
                    }
                }
            });
        } else {
            // 가짜 결제 성공
            var result = {
                success: true,
                paymentKey: 'test_payment_key_' + Date.now(),
                orderId: opts.orderId,
                amount: opts.amount,
                status: 'DONE',
                approvedAt: new Date().toISOString()
            };
            if (opts.successCallback) {
                sendCallbackToUnity(opts.gameObject, opts.successCallback, result);
            }
        }
    }
    
    // 배너 광고
    function aitShowBannerAd(options) {
        log('Showing banner ad...', options);
        
        var opts = JSON.parse(options);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.ad) {
            AppsInTossSDK.ad.showBannerAd({
                adUnitId: opts.adUnitId,
                position: opts.position,
                onLoad: function() {
                    var result = { success: true, message: 'Banner ad loaded' };
                    if (opts.loadedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.loadedCallback, result);
                    }
                },
                onError: function(error) {
                    var result = {
                        success: false,
                        message: error.message || 'Failed to load banner ad',
                        errorCode: error.code || -1
                    };
                    if (opts.failedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.failedCallback, result);
                    }
                },
                onClick: function() {
                    if (opts.clickedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.clickedCallback, {});
                    }
                }
            });
        } else {
            var result = { success: true, message: 'Banner ad loaded (test)' };
            if (opts.loadedCallback) {
                sendCallbackToUnity(opts.gameObject, opts.loadedCallback, result);
            }
        }
    }
    
    // 배너 광고 숨기기
    function aitHideBannerAd() {
        log('Hiding banner ad...');
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.ad) {
            AppsInTossSDK.ad.hideBannerAd();
        }
    }
    
    // 전면 광고
    function aitShowInterstitialAd(options) {
        log('Showing interstitial ad...', options);
        
        var opts = JSON.parse(options);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.ad) {
            AppsInTossSDK.ad.loadInterstitialAd({
                adUnitId: opts.adUnitId,
                onLoad: function() {
                    var result = { success: true, message: 'Interstitial ad loaded' };
                    if (opts.loadedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.loadedCallback, result);
                    }
                    
                    // 광고 표시
                    AppsInTossSDK.ad.showInterstitialAd({
                        onShow: function() {
                            if (opts.shownCallback) {
                                sendCallbackToUnity(opts.gameObject, opts.shownCallback, {});
                            }
                        },
                        onClose: function() {
                            if (opts.closedCallback) {
                                sendCallbackToUnity(opts.gameObject, opts.closedCallback, {});
                            }
                        },
                        onClick: function() {
                            if (opts.clickedCallback) {
                                sendCallbackToUnity(opts.gameObject, opts.clickedCallback, {});
                            }
                        }
                    });
                },
                onError: function(error) {
                    var result = {
                        success: false,
                        message: error.message || 'Failed to load interstitial ad',
                        errorCode: error.code || -1
                    };
                    if (opts.failedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.failedCallback, result);
                    }
                }
            });
        } else {
            // 가짜 광고 시뮬레이션
            var result = { success: true, message: 'Interstitial ad loaded (test)' };
            if (opts.loadedCallback) {
                sendCallbackToUnity(opts.gameObject, opts.loadedCallback, result);
            }
            setTimeout(function() {
                if (opts.shownCallback) {
                    sendCallbackToUnity(opts.gameObject, opts.shownCallback, {});
                }
                setTimeout(function() {
                    if (opts.closedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.closedCallback, {});
                    }
                }, 2000);
            }, 100);
        }
    }
    
    // 보상형 광고
    function aitShowRewardedAd(options) {
        log('Showing rewarded ad...', options);
        
        var opts = JSON.parse(options);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.ad) {
            AppsInTossSDK.ad.loadRewardedAd({
                adUnitId: opts.adUnitId,
                onLoad: function() {
                    var result = { success: true, message: 'Rewarded ad loaded' };
                    if (opts.loadedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.loadedCallback, result);
                    }
                    
                    // 광고 표시
                    AppsInTossSDK.ad.showRewardedAd({
                        onShow: function() {
                            if (opts.shownCallback) {
                                sendCallbackToUnity(opts.gameObject, opts.shownCallback, {});
                            }
                        },
                        onReward: function(reward) {
                            var result = {
                                success: true,
                                rewardType: reward.type || 'coins',
                                rewardAmount: reward.amount || 100
                            };
                            if (opts.rewardedCallback) {
                                sendCallbackToUnity(opts.gameObject, opts.rewardedCallback, result);
                            }
                        },
                        onClose: function() {
                            if (opts.closedCallback) {
                                sendCallbackToUnity(opts.gameObject, opts.closedCallback, {});
                            }
                        }
                    });
                },
                onError: function(error) {
                    var result = {
                        success: false,
                        message: error.message || 'Failed to load rewarded ad',
                        errorCode: error.code || -1
                    };
                    if (opts.failedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.failedCallback, result);
                    }
                }
            });
        } else {
            // 가짜 보상형 광고 시뮬레이션
            var result = { success: true, message: 'Rewarded ad loaded (test)' };
            if (opts.loadedCallback) {
                sendCallbackToUnity(opts.gameObject, opts.loadedCallback, result);
            }
            setTimeout(function() {
                if (opts.shownCallback) {
                    sendCallbackToUnity(opts.gameObject, opts.shownCallback, {});
                }
                setTimeout(function() {
                    var rewardResult = {
                        success: true,
                        rewardType: 'coins',
                        rewardAmount: 100
                    };
                    if (opts.rewardedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.rewardedCallback, rewardResult);
                    }
                    if (opts.closedCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.closedCallback, {});
                    }
                }, 3000);
            }, 100);
        }
    }
    
    // 스토리지 데이터 저장
    function aitSetStorageData(key, value, gameObject, callback) {
        log('Setting storage data:', { key: key, value: value });
        
        try {
            localStorage.setItem('ait_' + key, value);
            var result = { success: true, message: 'Data saved successfully' };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        } catch (error) {
            var result = {
                success: false,
                message: 'Failed to save data: ' + error.message,
                errorCode: -1
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 스토리지 데이터 조회
    function aitGetStorageData(key, gameObject, callback) {
        log('Getting storage data:', key);
        
        try {
            var value = localStorage.getItem('ait_' + key) || '';
            var result = {
                success: true,
                key: key,
                value: value
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        } catch (error) {
            var result = {
                success: false,
                message: 'Failed to get data: ' + error.message,
                errorCode: -1,
                key: key,
                value: ''
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 스토리지 데이터 삭제
    function aitRemoveStorageData(key, gameObject, callback) {
        log('Removing storage data:', key);
        
        try {
            localStorage.removeItem('ait_' + key);
            var result = { success: true, message: 'Data removed successfully' };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        } catch (error) {
            var result = {
                success: false,
                message: 'Failed to remove data: ' + error.message,
                errorCode: -1
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 텍스트 공유
    function aitShareText(options) {
        log('Sharing text...', options);
        
        var opts = JSON.parse(options);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.share) {
            AppsInTossSDK.share.shareText({
                text: opts.text,
                title: opts.title,
                success: function() {
                    var result = { success: true, message: 'Text shared successfully' };
                    if (opts.completeCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.completeCallback, result);
                    }
                },
                cancel: function() {
                    var result = { success: false, message: 'Share cancelled' };
                    if (opts.cancelCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.cancelCallback, result);
                    }
                }
            });
        } else {
            // Web Share API 사용 또는 클립보드 복사
            if (navigator.share) {
                navigator.share({
                    title: opts.title,
                    text: opts.text
                }).then(function() {
                    var result = { success: true, message: 'Text shared successfully' };
                    if (opts.completeCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.completeCallback, result);
                    }
                }).catch(function() {
                    var result = { success: false, message: 'Share cancelled' };
                    if (opts.cancelCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.cancelCallback, result);
                    }
                });
            } else {
                // 클립보드에 복사
                navigator.clipboard.writeText(opts.text).then(function() {
                    alert('텍스트가 클립보드에 복사되었습니다.');
                    var result = { success: true, message: 'Text copied to clipboard' };
                    if (opts.completeCallback) {
                        sendCallbackToUnity(opts.gameObject, opts.completeCallback, result);
                    }
                });
            }
        }
    }
    
    // 진동
    function aitVibrate(type) {
        log('Vibrating...', type);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.device) {
            var vibrationType = ['light', 'medium', 'heavy'][type] || 'light';
            AppsInTossSDK.device.vibrate(vibrationType);
        } else {
            // Web Vibration API 사용
            if (navigator.vibrate) {
                var pattern = [50, 100, 200][type] || 50;
                navigator.vibrate(pattern);
            }
        }
    }
    
    // 토스트 메시지
    function aitShowToast(options) {
        var opts = JSON.parse(options);
        log('Showing toast:', opts);
        
        var toast = document.createElement('div');
        toast.className = 'ait-toast ' + (opts.position || 'bottom');
        toast.textContent = opts.message;
        
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, opts.duration || 2000);
    }
    
    // 다이얼로그
    function aitShowDialog(options) {
        var opts = JSON.parse(options);
        log('Showing dialog:', opts);
        
        var modal = document.getElementById('ait-modal');
        var title = document.getElementById('ait-modal-title');
        var message = document.getElementById('ait-modal-message');
        var confirmBtn = document.getElementById('ait-modal-confirm');
        var cancelBtn = document.getElementById('ait-modal-cancel');
        
        title.textContent = opts.title || '';
        message.textContent = opts.message || '';
        confirmBtn.textContent = opts.confirmText || '확인';
        cancelBtn.textContent = opts.cancelText || '취소';
        
        if (opts.showCancel) {
            cancelBtn.style.display = 'block';
        } else {
            cancelBtn.style.display = 'none';
        }
        
        confirmBtn.onclick = function() {
            modal.style.display = 'none';
            if (opts.confirmCallback) {
                sendCallbackToUnity(opts.gameObject, opts.confirmCallback, {});
            }
        };
        
        cancelBtn.onclick = function() {
            modal.style.display = 'none';
            if (opts.cancelCallback) {
                sendCallbackToUnity(opts.gameObject, opts.cancelCallback, {});
            }
        };
        
        modal.style.display = 'flex';
    }
    
    // 네트워크 타입 조회
    function aitGetNetworkType(gameObject, callback) {
        log('Getting network type...');
        
        var networkType = 'unknown';
        var isConnected = navigator.onLine;
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.device) {
            AppsInTossSDK.device.getNetworkType(function(type) {
                var result = {
                    success: true,
                    networkType: type,
                    isConnected: isConnected
                };
                if (callback) {
                    sendCallbackToUnity(gameObject, callback, result);
                }
            });
        } else {
            // Navigator Connection API 사용
            if (navigator.connection) {
                var connection = navigator.connection;
                networkType = connection.effectiveType || connection.type || 'unknown';
            }
            
            var result = {
                success: true,
                networkType: networkType,
                isConnected: isConnected
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 기기 정보 조회
    function aitGetDeviceInfo(gameObject, callback) {
        log('Getting device info...');
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.device) {
            AppsInTossSDK.device.getDeviceInfo(function(info) {
                var result = {
                    success: true,
                    model: info.model,
                    brand: info.brand,
                    system: info.system,
                    version: info.version,
                    platform: info.platform,
                    language: info.language,
                    screenWidth: info.screenWidth,
                    screenHeight: info.screenHeight,
                    pixelRatio: info.pixelRatio
                };
                if (callback) {
                    sendCallbackToUnity(gameObject, callback, result);
                }
            });
        } else {
            var result = {
                success: true,
                model: 'Unknown',
                brand: 'Unknown',
                system: navigator.platform,
                version: navigator.userAgent,
                platform: 'Web',
                language: navigator.language,
                screenWidth: screen.width,
                screenHeight: screen.height,
                pixelRatio: window.devicePixelRatio || 1
            };
            if (callback) {
                sendCallbackToUnity(gameObject, callback, result);
            }
        }
    }
    
    // 이벤트 추적
    function aitTrackEvent(eventName, parameters) {
        log('Tracking event:', { name: eventName, parameters: parameters });
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.analytics) {
            var params = JSON.parse(parameters || '{}');
            AppsInTossSDK.analytics.trackEvent(eventName, params);
        }
    }
    
    // 사용자 속성 설정
    function aitSetUserProperties(properties) {
        log('Setting user properties:', properties);
        
        if (typeof AppsInTossSDK !== 'undefined' && AppsInTossSDK.analytics) {
            var props = JSON.parse(properties || '{}');
            AppsInTossSDK.analytics.setUserProperties(props);
        }
    }
    
    // 공개 인터페이스
    return {
        setUnityInstance: function(instance) {
            unityInstance = instance;
            log('Unity instance set');
        },
        
        setDebugMode: function(enabled) {
            debugMode = enabled;
        }
    };
})();

// Unity에서 호출할 수 있는 전역 함수들
window.aitInit = AppsInTossUnityBridge.aitInit || function(gameObject, callback) {
    AppsInTossUnityBridge.aitInit(gameObject, callback);
};

window.aitCheckLoginStatus = function(gameObject, callback) {
    if (typeof AppsInTossUnityBridge !== 'undefined') {
        AppsInTossUnityBridge.aitCheckLoginStatus(gameObject, callback);
    }
};

// 전역 함수들을 window 객체에 등록
var bridgeFunctions = [
    'aitInit', 'aitCheckLoginStatus', 'aitLogin', 'aitLogout', 'aitGetUserInfo',
    'aitRequestPayment', 'aitShowBannerAd', 'aitHideBannerAd', 'aitShowInterstitialAd', 'aitShowRewardedAd',
    'aitSetStorageData', 'aitGetStorageData', 'aitRemoveStorageData',
    'aitShareText', 'aitShareLink', 'aitShareImage',
    'aitVibrate', 'aitShowToast', 'aitShowDialog',
    'aitGetNetworkType', 'aitGetDeviceInfo', 'aitGetLocation',
    'aitTakePhoto', 'aitChooseImage', 'aitSetClipboardText', 'aitGetClipboardText',
    'aitTrackEvent', 'aitSetUserProperties', 'aitRequestAppReview', 'aitOpenURL',
    'aitCheckAppVersion', 'aitRequestPermission'
];

// 함수들을 실제로 구현하거나 더미로 만들기
bridgeFunctions.forEach(function(funcName) {
    if (!window[funcName]) {
        window[funcName] = function() {
            console.warn('Function not implemented:', funcName);
        };
    }
});

console.log('Apps in Toss Unity Bridge loaded successfully');