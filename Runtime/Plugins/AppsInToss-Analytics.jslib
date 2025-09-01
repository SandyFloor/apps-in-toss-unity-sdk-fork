/**
 * Apps in Toss Analytics Plugin for Unity WebGL
 * 사용자 분석 및 이벤트 추적
 */

var AppsInTossAnalyticsPlugin = {
    // 초기화 상태
    isInitialized: false,
    userId: null,
    sessionId: null,
    appVersion: null,
    
    // 분석 도구 초기화
    aitInitAnalytics: function(appVersionPtr, userIdPtr) {
        var appVersion = UTF8ToString(appVersionPtr);
        var userId = UTF8ToString(userIdPtr);
        
        console.log('[AIT Analytics] Initializing analytics:', { appVersion, userId });
        
        AppsInTossAnalyticsPlugin.appVersion = appVersion;
        AppsInTossAnalyticsPlugin.userId = userId;
        AppsInTossAnalyticsPlugin.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        AppsInTossAnalyticsPlugin.isInitialized = true;
        
        // 세션 시작 이벤트
        AppsInTossAnalyticsPlugin.trackEvent('session_start', {
            session_id: AppsInTossAnalyticsPlugin.sessionId,
            app_version: appVersion,
            user_id: userId,
            platform: 'web',
            timestamp: new Date().toISOString()
        });
        
        // 페이지 언로드 시 세션 종료 이벤트
        window.addEventListener('beforeunload', function() {
            AppsInTossAnalyticsPlugin.trackEvent('session_end', {
                session_id: AppsInTossAnalyticsPlugin.sessionId,
                duration: Date.now() - parseInt(AppsInTossAnalyticsPlugin.sessionId.split('_')[1])
            });
        });
        
        return 1; // 성공
    },
    
    // 이벤트 추적
    aitTrackEvent: function(eventNamePtr, parametersPtr) {
        var eventName = UTF8ToString(eventNamePtr);
        var parametersStr = UTF8ToString(parametersPtr);
        var parameters = {};
        
        try {
            if (parametersStr) {
                parameters = JSON.parse(parametersStr);
            }
        } catch (e) {
            console.error('[AIT Analytics] Failed to parse parameters:', e);
        }
        
        AppsInTossAnalyticsPlugin.trackEvent(eventName, parameters);
    },
    
    // 내부 이벤트 추적 함수
    trackEvent: function(eventName, parameters) {
        if (!AppsInTossAnalyticsPlugin.isInitialized) {
            console.warn('[AIT Analytics] Analytics not initialized, queuing event:', eventName);
            return;
        }
        
        console.log('[AIT Analytics] Tracking event:', eventName, parameters);
        
        // 기본 파라미터 추가
        var eventData = Object.assign({
            event_name: eventName,
            user_id: AppsInTossAnalyticsPlugin.userId,
            session_id: AppsInTossAnalyticsPlugin.sessionId,
            app_version: AppsInTossAnalyticsPlugin.appVersion,
            platform: 'web',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            user_agent: navigator.userAgent,
            screen_width: screen.width,
            screen_height: screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight
        }, parameters);
        
        // Apps in Toss 분석 서버로 전송
        AppsInTossAnalyticsPlugin.sendAnalyticsData('event', eventData);
        
        // Google Analytics (gtag)가 있다면 동시에 전송
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Facebook Pixel이 있다면 동시에 전송
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName, parameters);
        }
    },
    
    // 사용자 속성 설정
    aitSetUserProperties: function(propertiesPtr) {
        var propertiesStr = UTF8ToString(propertiesPtr);
        var properties = {};
        
        try {
            if (propertiesStr) {
                properties = JSON.parse(propertiesStr);
            }
        } catch (e) {
            console.error('[AIT Analytics] Failed to parse user properties:', e);
            return;
        }
        
        console.log('[AIT Analytics] Setting user properties:', properties);
        
        // 사용자 속성에 기본 정보 추가
        var userData = Object.assign({
            user_id: AppsInTossAnalyticsPlugin.userId,
            app_version: AppsInTossAnalyticsPlugin.appVersion,
            platform: 'web',
            set_at: new Date().toISOString()
        }, properties);
        
        // Apps in Toss 분석 서버로 전송
        AppsInTossAnalyticsPlugin.sendAnalyticsData('user_properties', userData);
        
        // Google Analytics (gtag)가 있다면 동시에 전송
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                custom_map: properties
            });
        }
    },
    
    // 화면 조회 추적
    aitTrackScreen: function(screenNamePtr, parametersPtr) {
        var screenName = UTF8ToString(screenNamePtr);
        var parametersStr = UTF8ToString(parametersPtr);
        var parameters = {};
        
        try {
            if (parametersStr) {
                parameters = JSON.parse(parametersStr);
            }
        } catch (e) {
            console.error('[AIT Analytics] Failed to parse screen parameters:', e);
        }
        
        console.log('[AIT Analytics] Tracking screen view:', screenName, parameters);
        
        var screenData = Object.assign({
            screen_name: screenName,
            user_id: AppsInTossAnalyticsPlugin.userId,
            session_id: AppsInTossAnalyticsPlugin.sessionId,
            app_version: AppsInTossAnalyticsPlugin.appVersion,
            timestamp: new Date().toISOString()
        }, parameters);
        
        AppsInTossAnalyticsPlugin.sendAnalyticsData('screen_view', screenData);
        
        // Google Analytics 페이지뷰
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: screenName,
                page_location: window.location.href
            });
        }
    },
    
    // 구매 이벤트 추적
    aitTrackPurchase: function(transactionIdPtr, itemsPtr, valuePtr, currencyPtr) {
        var transactionId = UTF8ToString(transactionIdPtr);
        var itemsStr = UTF8ToString(itemsPtr);
        var value = parseFloat(UTF8ToString(valuePtr));
        var currency = UTF8ToString(currencyPtr);
        var items = [];
        
        try {
            if (itemsStr) {
                items = JSON.parse(itemsStr);
            }
        } catch (e) {
            console.error('[AIT Analytics] Failed to parse purchase items:', e);
        }
        
        console.log('[AIT Analytics] Tracking purchase:', { transactionId, items, value, currency });
        
        var purchaseData = {
            event_name: 'purchase',
            transaction_id: transactionId,
            value: value,
            currency: currency,
            items: items,
            user_id: AppsInTossAnalyticsPlugin.userId,
            session_id: AppsInTossAnalyticsPlugin.sessionId,
            timestamp: new Date().toISOString()
        };
        
        AppsInTossAnalyticsPlugin.sendAnalyticsData('purchase', purchaseData);
        
        // Google Analytics Enhanced Ecommerce
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: value,
                currency: currency,
                items: items
            });
        }
        
        // Facebook Pixel 구매 이벤트
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: value,
                currency: currency,
                content_ids: items.map(function(item) { return item.item_id; }),
                content_type: 'product'
            });
        }
    },
    
    // 레벨 완료 이벤트 추적
    aitTrackLevelComplete: function(levelPtr, scorePtr, durationPtr) {
        var level = UTF8ToString(levelPtr);
        var score = parseInt(UTF8ToString(scorePtr));
        var duration = parseInt(UTF8ToString(durationPtr));
        
        console.log('[AIT Analytics] Tracking level complete:', { level, score, duration });
        
        AppsInTossAnalyticsPlugin.trackEvent('level_complete', {
            level: level,
            score: score,
            duration_seconds: duration,
            success: true
        });
    },
    
    // 게임 시작 이벤트 추적
    aitTrackGameStart: function(levelPtr, modePtr) {
        var level = UTF8ToString(levelPtr);
        var mode = UTF8ToString(modePtr);
        
        console.log('[AIT Analytics] Tracking game start:', { level, mode });
        
        AppsInTossAnalyticsPlugin.trackEvent('game_start', {
            level: level,
            game_mode: mode
        });
    },
    
    // 게임 종료 이벤트 추적
    aitTrackGameEnd: function(levelPtr, scorePtr, reasonPtr) {
        var level = UTF8ToString(levelPtr);
        var score = parseInt(UTF8ToString(scorePtr));
        var reason = UTF8ToString(reasonPtr);
        
        console.log('[AIT Analytics] Tracking game end:', { level, score, reason });
        
        AppsInTossAnalyticsPlugin.trackEvent('game_end', {
            level: level,
            score: score,
            end_reason: reason
        });
    },
    
    // 오류 추적
    aitTrackError: function(errorTypePtr, errorMessagePtr, stackTracePtr) {
        var errorType = UTF8ToString(errorTypePtr);
        var errorMessage = UTF8ToString(errorMessagePtr);
        var stackTrace = UTF8ToString(stackTracePtr);
        
        console.log('[AIT Analytics] Tracking error:', { errorType, errorMessage, stackTrace });
        
        AppsInTossAnalyticsPlugin.trackEvent('error', {
            error_type: errorType,
            error_message: errorMessage,
            stack_trace: stackTrace,
            url: window.location.href,
            user_agent: navigator.userAgent
        });
    },
    
    // 성능 메트릭 추적
    aitTrackPerformance: function(metricNamePtr, valuePtr, unitPtr) {
        var metricName = UTF8ToString(metricNamePtr);
        var value = parseFloat(UTF8ToString(valuePtr));
        var unit = UTF8ToString(unitPtr);
        
        console.log('[AIT Analytics] Tracking performance metric:', { metricName, value, unit });
        
        AppsInTossAnalyticsPlugin.trackEvent('performance_metric', {
            metric_name: metricName,
            value: value,
            unit: unit
        });
    },
    
    // 분석 데이터 전송 (내부 함수)
    sendAnalyticsData: function(type, data) {
        try {
            // Apps in Toss 분석 서버로 전송
            fetch('/api/analytics/' + type, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                keepalive: true // 페이지 언로드 시에도 전송 보장
            }).catch(function(error) {
                console.warn('[AIT Analytics] Failed to send analytics data:', error);
                
                // 실패 시 로컬 스토리지에 저장 후 나중에 재시도
                var queueKey = 'ait_analytics_queue';
                var queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
                queue.push({ type: type, data: data, timestamp: Date.now() });
                
                // 큐 크기 제한 (최대 100개)
                if (queue.length > 100) {
                    queue = queue.slice(-100);
                }
                
                localStorage.setItem(queueKey, JSON.stringify(queue));
            });
        } catch (error) {
            console.error('[AIT Analytics] Exception during analytics data send:', error);
        }
    },
    
    // 대기열에 있는 분석 데이터 재전송
    aitFlushAnalyticsQueue: function() {
        console.log('[AIT Analytics] Flushing analytics queue...');
        
        var queueKey = 'ait_analytics_queue';
        var queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
        
        if (queue.length === 0) {
            return;
        }
        
        // 24시간 이상 된 데이터는 제거
        var oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        queue = queue.filter(function(item) {
            return item.timestamp > oneDayAgo;
        });
        
        // 각 항목을 재전송 시도
        var remainingQueue = [];
        queue.forEach(function(item) {
            AppsInTossAnalyticsPlugin.sendAnalyticsData(item.type, item.data);
        });
        
        // 큐 비우기
        localStorage.removeItem(queueKey);
    }
};

// Unity에서 사용할 수 있도록 함수들을 전역에 등록
mergeInto(LibraryManager.library, AppsInTossAnalyticsPlugin);

// 페이지 로드 완료 후 대기열 처리
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            AppsInTossAnalyticsPlugin.aitFlushAnalyticsQueue();
        }, 1000);
    });
} else {
    setTimeout(function() {
        AppsInTossAnalyticsPlugin.aitFlushAnalyticsQueue();
    }, 1000);
}