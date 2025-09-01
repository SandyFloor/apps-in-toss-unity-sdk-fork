/**
 * Apps in Toss Performance Plugin for Unity WebGL
 * 성능 모니터링 - 메모리, CPU, 렌더링, 로딩 성능 추적
 * 
 * WeChat Mini Program의 wx.getPerformance, wx.reportAnalytics,
 * wx.onMemoryWarning API를 참고하여 구현
 */

var AppsInTossPerformancePlugin = {
    // 성능 모니터링 상태
    performanceState: {
        monitoring: false,
        startTime: 0,
        metrics: {
            memory: { used: 0, total: 0, percentage: 0 },
            fps: { current: 0, average: 0, history: [] },
            loading: { total: 0, completed: 0, failed: 0 },
            rendering: { drawCalls: 0, triangles: 0, setPassCalls: 0 },
            network: { requests: 0, totalTime: 0, averageTime: 0 }
        },
        observers: {},
        callbacks: {}
    },
    
    // 성능 측정 인터벌
    performanceInterval: null,
    fpsTracker: {
        lastTime: 0,
        frames: 0,
        fps: 0
    },
    
    /**
     * 성능 모니터링 시작
     */
    aitStartPerformanceMonitoring: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Performance] Starting performance monitoring:', options);
        
        try {
            AppsInTossPerformancePlugin.performanceState.monitoring = true;
            AppsInTossPerformancePlugin.performanceState.startTime = performance.now();
            
            // 성능 메트릭 수집 시작
            AppsInTossPerformancePlugin.startMetricsCollection(options);
            
            // FPS 추적 시작
            AppsInTossPerformancePlugin.startFPSTracking();
            
            // 메모리 추적 시작
            AppsInTossPerformancePlugin.startMemoryTracking();
            
            // 네트워크 추적 시작
            AppsInTossPerformancePlugin.startNetworkTracking();
            
            // 성공 콜백
            AppsInTossPerformancePlugin.sendCallback(options, 'onSuccess', {
                success: true,
                message: 'Performance monitoring started',
                startTime: AppsInTossPerformancePlugin.performanceState.startTime
            });
            
        } catch (error) {
            console.error('[AIT Performance] Start monitoring error:', error);
            AppsInTossPerformancePlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 성능 모니터링 중지
     */
    aitStopPerformanceMonitoring: function() {
        console.log('[AIT Performance] Stopping performance monitoring');
        
        AppsInTossPerformancePlugin.performanceState.monitoring = false;
        
        // 인터벌 정리
        if (AppsInTossPerformancePlugin.performanceInterval) {
            clearInterval(AppsInTossPerformancePlugin.performanceInterval);
            AppsInTossPerformancePlugin.performanceInterval = null;
        }
        
        // 모든 옵저버 정리
        AppsInTossPerformancePlugin.performanceState.observers = {};
        AppsInTossPerformancePlugin.performanceState.callbacks = {};
    },
    
    /**
     * 메트릭 수집 시작
     */
    startMetricsCollection: function(options) {
        var interval = options.interval || 1000; // 기본 1초
        
        AppsInTossPerformancePlugin.performanceInterval = setInterval(function() {
            if (!AppsInTossPerformancePlugin.performanceState.monitoring) {
                return;
            }
            
            AppsInTossPerformancePlugin.collectAllMetrics();
        }, interval);
    },
    
    /**
     * FPS 추적 시작
     */
    startFPSTracking: function() {
        var tracker = AppsInTossPerformancePlugin.fpsTracker;
        
        function updateFPS() {
            if (!AppsInTossPerformancePlugin.performanceState.monitoring) {
                return;
            }
            
            var now = performance.now();
            tracker.frames++;
            
            if (now - tracker.lastTime >= 1000) { // 1초마다 계산
                tracker.fps = Math.round((tracker.frames * 1000) / (now - tracker.lastTime));
                
                var metrics = AppsInTossPerformancePlugin.performanceState.metrics;
                metrics.fps.current = tracker.fps;
                metrics.fps.history.push(tracker.fps);
                
                // 히스토리 최대 60개 유지 (1분)
                if (metrics.fps.history.length > 60) {
                    metrics.fps.history.shift();
                }
                
                // 평균 FPS 계산
                var sum = metrics.fps.history.reduce(function(a, b) { return a + b; }, 0);
                metrics.fps.average = Math.round(sum / metrics.fps.history.length);
                
                tracker.lastTime = now;
                tracker.frames = 0;
            }
            
            requestAnimationFrame(updateFPS);
        }
        
        requestAnimationFrame(updateFPS);
    },
    
    /**
     * 메모리 추적 시작
     */
    startMemoryTracking: function() {
        // Performance Memory API 지원 확인
        if (performance.memory) {
            console.log('[AIT Performance] Memory tracking available');
        } else {
            console.warn('[AIT Performance] Memory API not supported');
        }
    },
    
    /**
     * 네트워크 추적 시작
     */
    startNetworkTracking: function() {
        // Performance Observer for network requests
        if (typeof PerformanceObserver !== 'undefined') {
            try {
                var observer = new PerformanceObserver(function(list) {
                    var entries = list.getEntries();
                    AppsInTossPerformancePlugin.processNetworkEntries(entries);
                });
                
                observer.observe({ entryTypes: ['resource', 'navigation'] });
                AppsInTossPerformancePlugin.performanceState.observers.network = observer;
                
            } catch (error) {
                console.warn('[AIT Performance] PerformanceObserver not supported:', error);
            }
        }
    },
    
    /**
     * 모든 메트릭 수집
     */
    collectAllMetrics: function() {
        var metrics = AppsInTossPerformancePlugin.performanceState.metrics;
        
        // 메모리 메트릭 수집
        if (performance.memory) {
            metrics.memory.used = performance.memory.usedJSHeapSize;
            metrics.memory.total = performance.memory.totalJSHeapSize;
            metrics.memory.percentage = Math.round((metrics.memory.used / metrics.memory.total) * 100);
        }
        
        // 렌더링 메트릭 수집 (Unity WebGL에서는 제한적)
        AppsInTossPerformancePlugin.collectRenderingMetrics();
        
        // 메트릭 브로드캐스트
        AppsInTossPerformancePlugin.broadcastMetrics(metrics);
    },
    
    /**
     * 렌더링 메트릭 수집
     */
    collectRenderingMetrics: function() {
        // WebGL 컨텍스트에서 렌더링 정보 수집 시도
        var canvas = document.querySelector('canvas');
        if (canvas) {
            var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                var metrics = AppsInTossPerformancePlugin.performanceState.metrics;
                
                // WebGL 확장 정보
                var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    metrics.rendering.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    metrics.rendering.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                }
            }
        }
    },
    
    /**
     * 네트워크 엔트리 처리
     */
    processNetworkEntries: function(entries) {
        var networkMetrics = AppsInTossPerformancePlugin.performanceState.metrics.network;
        
        entries.forEach(function(entry) {
            if (entry.entryType === 'resource') {
                networkMetrics.requests++;
                
                var duration = entry.responseEnd - entry.requestStart;
                networkMetrics.totalTime += duration;
                networkMetrics.averageTime = networkMetrics.totalTime / networkMetrics.requests;
            }
        });
    },
    
    /**
     * 성능 보고서 생성
     */
    aitGetPerformanceReport: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Performance] Generating performance report');
        
        try {
            var currentTime = performance.now();
            var uptime = currentTime - AppsInTossPerformancePlugin.performanceState.startTime;
            
            var report = {
                timestamp: currentTime,
                uptime: uptime,
                metrics: AppsInTossPerformancePlugin.performanceState.metrics,
                systemInfo: AppsInTossPerformancePlugin.getSystemInfo(),
                performanceEntries: AppsInTossPerformancePlugin.getPerformanceEntries(),
                recommendations: AppsInTossPerformancePlugin.generateRecommendations()
            };
            
            AppsInTossPerformancePlugin.sendCallback(options, 'onSuccess', {
                success: true,
                report: report
            });
            
        } catch (error) {
            console.error('[AIT Performance] Generate report error:', error);
            AppsInTossPerformancePlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 시스템 정보 수집
     */
    getSystemInfo: function() {
        var info = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency || 1,
            deviceMemory: navigator.deviceMemory || 'unknown',
            connection: {}
        };
        
        // 네트워크 연결 정보
        if (navigator.connection) {
            info.connection = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        
        return info;
    },
    
    /**
     * Performance API 엔트리 수집
     */
    getPerformanceEntries: function() {
        var entries = {
            navigation: [],
            resource: [],
            measure: [],
            mark: []
        };
        
        try {
            // Navigation Timing
            var navEntries = performance.getEntriesByType('navigation');
            entries.navigation = navEntries.map(function(entry) {
                return {
                    name: entry.name,
                    startTime: entry.startTime,
                    duration: entry.duration,
                    loadEventEnd: entry.loadEventEnd,
                    domContentLoadedEventEnd: entry.domContentLoadedEventEnd
                };
            });
            
            // Resource Timing
            var resourceEntries = performance.getEntriesByType('resource');
            entries.resource = resourceEntries.slice(-20).map(function(entry) { // 최근 20개만
                return {
                    name: entry.name,
                    startTime: entry.startTime,
                    duration: entry.duration,
                    transferSize: entry.transferSize,
                    encodedBodySize: entry.encodedBodySize
                };
            });
            
            // User Timing
            entries.measure = performance.getEntriesByType('measure');
            entries.mark = performance.getEntriesByType('mark');
            
        } catch (error) {
            console.warn('[AIT Performance] Error collecting performance entries:', error);
        }
        
        return entries;
    },
    
    /**
     * 성능 최적화 권장사항 생성
     */
    generateRecommendations: function() {
        var recommendations = [];
        var metrics = AppsInTossPerformancePlugin.performanceState.metrics;
        
        // 메모리 사용량 체크
        if (metrics.memory.percentage > 80) {
            recommendations.push({
                type: 'memory',
                level: 'warning',
                message: 'High memory usage detected (' + metrics.memory.percentage + '%)',
                suggestion: 'Consider reducing texture quality or clearing unused assets'
            });
        }
        
        // FPS 체크
        if (metrics.fps.average < 30) {
            recommendations.push({
                type: 'fps',
                level: 'warning',
                message: 'Low FPS detected (avg: ' + metrics.fps.average + ')',
                suggestion: 'Optimize rendering or reduce visual effects'
            });
        }
        
        // 네트워크 성능 체크
        if (metrics.network.averageTime > 1000) {
            recommendations.push({
                type: 'network',
                level: 'info',
                message: 'Slow network requests (avg: ' + Math.round(metrics.network.averageTime) + 'ms)',
                suggestion: 'Consider optimizing asset loading or using CDN'
            });
        }
        
        return recommendations;
    },
    
    /**
     * 커스텀 메트릭 추가
     */
    aitReportCustomMetric: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Performance] Reporting custom metric:', options.name, options.value);
        
        try {
            // Performance mark 생성
            if (performance.mark) {
                performance.mark('ait_metric_' + options.name);
            }
            
            // 커스텀 메트릭 저장
            if (!AppsInTossPerformancePlugin.performanceState.metrics.custom) {
                AppsInTossPerformancePlugin.performanceState.metrics.custom = {};
            }
            
            AppsInTossPerformancePlugin.performanceState.metrics.custom[options.name] = {
                value: options.value,
                timestamp: performance.now(),
                type: options.type || 'numeric'
            };
            
            AppsInTossPerformancePlugin.sendCallback(options, 'onSuccess', {
                success: true,
                metric: options.name,
                value: options.value
            });
            
        } catch (error) {
            console.error('[AIT Performance] Report custom metric error:', error);
            AppsInTossPerformancePlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 메모리 경고 리스너 등록
     */
    aitOnMemoryWarning: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Performance] Registering memory warning listener');
        
        // 메모리 임계값 모니터링
        if (!AppsInTossPerformancePlugin.memoryWarningInterval) {
            AppsInTossPerformancePlugin.memoryWarningInterval = setInterval(function() {
                if (performance.memory) {
                    var percentage = (performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100;
                    
                    if (percentage > 85) { // 85% 이상 사용 시 경고
                        AppsInTossPerformancePlugin.sendCallback(options, 'onMemoryWarning', {
                            level: percentage > 95 ? 'critical' : 'warning',
                            usedMemory: performance.memory.usedJSHeapSize,
                            totalMemory: performance.memory.totalJSHeapSize,
                            percentage: Math.round(percentage)
                        });
                    }
                }
            }, 5000); // 5초마다 체크
        }
    },
    
    /**
     * 성능 이벤트 콜백 등록
     */
    aitOnPerformanceEvent: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Performance] Registering performance event callback:', options.eventType);
        
        if (!AppsInTossPerformancePlugin.performanceState.callbacks[options.eventType]) {
            AppsInTossPerformancePlugin.performanceState.callbacks[options.eventType] = [];
        }
        
        AppsInTossPerformancePlugin.performanceState.callbacks[options.eventType].push({
            gameObject: options.gameObject,
            callback: options.callback
        });
    },
    
    /**
     * 헬퍼 함수들
     */
    
    broadcastMetrics: function(metrics) {
        var callbacks = AppsInTossPerformancePlugin.performanceState.callbacks['metricsUpdate'];
        if (callbacks && callbacks.length > 0) {
            callbacks.forEach(function(item) {
                var callbackData = {
                    callbackName: item.callback,
                    result: JSON.stringify({
                        eventType: 'metricsUpdate',
                        metrics: metrics,
                        timestamp: performance.now()
                    })
                };
                SendMessage(item.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            });
        }
    },
    
    sendCallback: function(options, callbackType, data) {
        if (options.gameObject && options[callbackType]) {
            var callbackData = {
                callbackName: options[callbackType],
                result: JSON.stringify(data)
            };
            SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
        }
    }
};

// Unity에서 사용할 수 있도록 함수들을 전역에 등록
mergeInto(LibraryManager.library, AppsInTossPerformancePlugin);