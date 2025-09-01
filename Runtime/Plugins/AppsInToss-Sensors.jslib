/**
 * Apps in Toss Sensors Plugin for Unity WebGL
 * 센서 시스템 - 가속도계, 자이로스코프, 나침반, 기기 방향
 * 
 * WeChat Mini Program의 wx.startAccelerometer, wx.onAccelerometerChange,
 * wx.onGyroscopeChange, wx.onCompassChange API를 참고하여 구현
 */

var AppsInTossSensorsPlugin = {
    // 센서 상태 관리
    sensorsState: {
        accelerometer: {
            active: false,
            interval: 'ui', // 'ui', 'game', 'normal'
            data: { x: 0, y: 0, z: 0 }
        },
        gyroscope: {
            active: false,
            interval: 'ui',
            data: { x: 0, y: 0, z: 0 }
        },
        compass: {
            active: false,
            data: { direction: 0, accuracy: 0 }
        },
        deviceOrientation: {
            active: false,
            data: { alpha: 0, beta: 0, gamma: 0 }
        }
    },
    
    // 이벤트 리스너 참조
    eventListeners: {
        deviceMotion: null,
        deviceOrientation: null
    },
    
    // 콜백 저장소
    callbacks: {},
    
    /**
     * 가속도계 시작
     */
    aitStartAccelerometer: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Sensors] Starting accelerometer:', options);
        
        // 이미 활성화된 경우 중지 후 재시작
        if (AppsInTossSensorsPlugin.sensorsState.accelerometer.active) {
            AppsInTossSensorsPlugin.aitStopAccelerometer();
        }
        
        // DeviceMotionEvent 지원 확인
        if (typeof DeviceMotionEvent === 'undefined') {
            console.error('[AIT Sensors] DeviceMotionEvent not supported');
            AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: 'Accelerometer not supported',
                errorCode: -1
            });
            return;
        }
        
        // 권한 요청 (iOS 13+)
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(function(response) {
                    if (response === 'granted') {
                        AppsInTossSensorsPlugin.startAccelerometerListener(options);
                    } else {
                        AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                            success: false,
                            error: 'Accelerometer permission denied',
                            errorCode: -2
                        });
                    }
                })
                .catch(function(error) {
                    console.error('[AIT Sensors] Permission request error:', error);
                    // 권한 요청 실패 시에도 시도해봄
                    AppsInTossSensorsPlugin.startAccelerometerListener(options);
                });
        } else {
            AppsInTossSensorsPlugin.startAccelerometerListener(options);
        }
    },
    
    /**
     * 가속도계 리스너 시작
     */
    startAccelerometerListener: function(options) {
        try {
            var interval = options.interval || 'ui';
            AppsInTossSensorsPlugin.sensorsState.accelerometer.interval = interval;
            AppsInTossSensorsPlugin.sensorsState.accelerometer.active = true;
            
            // 인터벌에 따른 주기 설정 (ms)
            var intervalMs = AppsInTossSensorsPlugin.getIntervalMs(interval);
            var lastUpdate = 0;
            
            var listener = function(event) {
                var now = Date.now();
                if (now - lastUpdate < intervalMs) {
                    return;
                }
                lastUpdate = now;
                
                if (event.acceleration) {
                    var acceleration = event.acceleration;
                    var data = {
                        x: acceleration.x || 0,
                        y: acceleration.y || 0,
                        z: acceleration.z || 0,
                        timestamp: now
                    };
                    
                    AppsInTossSensorsPlugin.sensorsState.accelerometer.data = data;
                    
                    // 등록된 모든 콜백에 데이터 전송
                    AppsInTossSensorsPlugin.broadcastSensorData('accelerometer', data);
                }
            };
            
            window.addEventListener('devicemotion', listener);
            AppsInTossSensorsPlugin.eventListeners.deviceMotion = listener;
            
            // 성공 콜백
            AppsInTossSensorsPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                message: 'Accelerometer started',
                interval: interval
            });
            
        } catch (error) {
            console.error('[AIT Sensors] Start accelerometer error:', error);
            AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -3
            });
        }
    },
    
    /**
     * 가속도계 중지
     */
    aitStopAccelerometer: function() {
        console.log('[AIT Sensors] Stopping accelerometer');
        
        AppsInTossSensorsPlugin.sensorsState.accelerometer.active = false;
        
        if (AppsInTossSensorsPlugin.eventListeners.deviceMotion) {
            window.removeEventListener('devicemotion', AppsInTossSensorsPlugin.eventListeners.deviceMotion);
            AppsInTossSensorsPlugin.eventListeners.deviceMotion = null;
        }
    },
    
    /**
     * 자이로스코프 시작
     */
    aitStartGyroscope: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Sensors] Starting gyroscope:', options);
        
        // DeviceOrientationEvent 지원 확인
        if (typeof DeviceOrientationEvent === 'undefined') {
            console.error('[AIT Sensors] DeviceOrientationEvent not supported');
            AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: 'Gyroscope not supported',
                errorCode: -1
            });
            return;
        }
        
        // 권한 요청 (iOS 13+)
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(function(response) {
                    if (response === 'granted') {
                        AppsInTossSensorsPlugin.startGyroscopeListener(options);
                    } else {
                        AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                            success: false,
                            error: 'Gyroscope permission denied',
                            errorCode: -2
                        });
                    }
                })
                .catch(function(error) {
                    console.error('[AIT Sensors] Gyroscope permission request error:', error);
                    AppsInTossSensorsPlugin.startGyroscopeListener(options);
                });
        } else {
            AppsInTossSensorsPlugin.startGyroscopeListener(options);
        }
    },
    
    /**
     * 자이로스코프 리스너 시작
     */
    startGyroscopeListener: function(options) {
        try {
            var interval = options.interval || 'ui';
            AppsInTossSensorsPlugin.sensorsState.gyroscope.interval = interval;
            AppsInTossSensorsPlugin.sensorsState.gyroscope.active = true;
            
            var intervalMs = AppsInTossSensorsPlugin.getIntervalMs(interval);
            var lastUpdate = 0;
            
            var listener = function(event) {
                var now = Date.now();
                if (now - lastUpdate < intervalMs) {
                    return;
                }
                lastUpdate = now;
                
                var data = {
                    x: event.beta || 0,   // X축 회전 (전후 기울기)
                    y: event.gamma || 0,  // Y축 회전 (좌우 기울기)
                    z: event.alpha || 0,  // Z축 회전 (나침반 방향)
                    timestamp: now
                };
                
                AppsInTossSensorsPlugin.sensorsState.gyroscope.data = data;
                AppsInTossSensorsPlugin.broadcastSensorData('gyroscope', data);
            };
            
            window.addEventListener('deviceorientation', listener);
            AppsInTossSensorsPlugin.eventListeners.deviceOrientation = listener;
            
            AppsInTossSensorsPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                message: 'Gyroscope started',
                interval: interval
            });
            
        } catch (error) {
            console.error('[AIT Sensors] Start gyroscope error:', error);
            AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -3
            });
        }
    },
    
    /**
     * 자이로스코프 중지
     */
    aitStopGyroscope: function() {
        console.log('[AIT Sensors] Stopping gyroscope');
        
        AppsInTossSensorsPlugin.sensorsState.gyroscope.active = false;
        
        if (AppsInTossSensorsPlugin.eventListeners.deviceOrientation) {
            window.removeEventListener('deviceorientation', AppsInTossSensorsPlugin.eventListeners.deviceOrientation);
            AppsInTossSensorsPlugin.eventListeners.deviceOrientation = null;
        }
    },
    
    /**
     * 나침반 시작
     */
    aitStartCompass: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Sensors] Starting compass:', options);
        
        // 지자기 센서 지원 확인
        if (navigator.geolocation) {
            AppsInTossSensorsPlugin.sensorsState.compass.active = true;
            
            // 지자기 센서는 DeviceOrientationEvent를 사용하여 구현
            var listener = function(event) {
                var direction = event.alpha || 0; // 0-360도
                var accuracy = event.accuracy || 0;
                
                var data = {
                    direction: direction,
                    accuracy: accuracy,
                    timestamp: Date.now()
                };
                
                AppsInTossSensorsPlugin.sensorsState.compass.data = data;
                AppsInTossSensorsPlugin.broadcastSensorData('compass', data);
            };
            
            window.addEventListener('deviceorientationabsolute', listener);
            
            // fallback for non-absolute orientation
            if (!AppsInTossSensorsPlugin.eventListeners.deviceOrientation) {
                window.addEventListener('deviceorientation', listener);
            }
            
            AppsInTossSensorsPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                message: 'Compass started'
            });
        } else {
            AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: 'Compass not supported',
                errorCode: -1
            });
        }
    },
    
    /**
     * 나침반 중지
     */
    aitStopCompass: function() {
        console.log('[AIT Sensors] Stopping compass');
        AppsInTossSensorsPlugin.sensorsState.compass.active = false;
    },
    
    /**
     * 기기 방향 감지 시작
     */
    aitStartDeviceMotion: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Sensors] Starting device motion:', options);
        
        try {
            AppsInTossSensorsPlugin.sensorsState.deviceOrientation.active = true;
            
            var listener = function(event) {
                var data = {
                    alpha: event.alpha || 0,  // Z축 회전 (0-360도)
                    beta: event.beta || 0,    // X축 회전 (-180~180도)
                    gamma: event.gamma || 0,  // Y축 회전 (-90~90도)
                    absolute: event.absolute || false,
                    timestamp: Date.now()
                };
                
                AppsInTossSensorsPlugin.sensorsState.deviceOrientation.data = data;
                AppsInTossSensorsPlugin.broadcastSensorData('deviceMotion', data);
            };
            
            window.addEventListener('deviceorientation', listener);
            
            AppsInTossSensorsPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                message: 'Device motion started'
            });
            
        } catch (error) {
            AppsInTossSensorsPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 기기 방향 감지 중지
     */
    aitStopDeviceMotion: function() {
        console.log('[AIT Sensors] Stopping device motion');
        AppsInTossSensorsPlugin.sensorsState.deviceOrientation.active = false;
    },
    
    /**
     * 센서 데이터 콜백 등록
     */
    aitOnSensorChange: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Sensors] Registering sensor callback:', options.sensorType);
        
        if (!AppsInTossSensorsPlugin.callbacks[options.sensorType]) {
            AppsInTossSensorsPlugin.callbacks[options.sensorType] = [];
        }
        
        AppsInTossSensorsPlugin.callbacks[options.sensorType].push({
            gameObject: options.gameObject,
            callback: options.callback
        });
    },
    
    /**
     * 센서 데이터 콜백 해제
     */
    aitOffSensorChange: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Sensors] Unregistering sensor callback:', options.sensorType);
        
        if (AppsInTossSensorsPlugin.callbacks[options.sensorType]) {
            AppsInTossSensorsPlugin.callbacks[options.sensorType] = 
                AppsInTossSensorsPlugin.callbacks[options.sensorType].filter(function(item) {
                    return item.gameObject !== options.gameObject || item.callback !== options.callback;
                });
        }
    },
    
    /**
     * 센서 상태 조회
     */
    aitGetSensorState: function(sensorTypePtr) {
        var sensorType = UTF8ToString(sensorTypePtr);
        
        console.log('[AIT Sensors] Getting sensor state:', sensorType);
        
        var state = AppsInTossSensorsPlugin.sensorsState[sensorType];
        if (state) {
            return JSON.stringify({
                active: state.active,
                data: state.data,
                interval: state.interval
            });
        }
        
        return JSON.stringify({ active: false });
    },
    
    /**
     * 모든 센서 중지
     */
    aitStopAllSensors: function() {
        console.log('[AIT Sensors] Stopping all sensors');
        
        AppsInTossSensorsPlugin.aitStopAccelerometer();
        AppsInTossSensorsPlugin.aitStopGyroscope();
        AppsInTossSensorsPlugin.aitStopCompass();
        AppsInTossSensorsPlugin.aitStopDeviceMotion();
        
        // 모든 콜백 정리
        AppsInTossSensorsPlugin.callbacks = {};
    },
    
    /**
     * 센서 권한 상태 확인
     */
    aitCheckSensorPermissions: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Sensors] Checking sensor permissions');
        
        var permissions = {
            accelerometer: false,
            gyroscope: false,
            magnetometer: false
        };
        
        // DeviceMotionEvent 권한 확인
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+ 권한 시스템
            permissions.accelerometer = 'requestable';
            permissions.gyroscope = 'requestable';
        } else if (typeof DeviceMotionEvent !== 'undefined') {
            // 권한 요청 불필요 (Android 등)
            permissions.accelerometer = true;
            permissions.gyroscope = true;
        }
        
        // 나침반/자력계는 DeviceOrientationEvent로 확인
        if (typeof DeviceOrientationEvent !== 'undefined') {
            permissions.magnetometer = true;
        }
        
        AppsInTossSensorsPlugin.sendCallback(options, 'onSuccess', {
            success: true,
            permissions: permissions
        });
    },
    
    /**
     * 헬퍼 함수들
     */
    
    getIntervalMs: function(interval) {
        switch (interval) {
            case 'ui': return 60;     // 60ms (16.7fps)
            case 'game': return 20;   // 20ms (50fps)  
            case 'normal': return 200; // 200ms (5fps)
            default: return 60;
        }
    },
    
    broadcastSensorData: function(sensorType, data) {
        var callbacks = AppsInTossSensorsPlugin.callbacks[sensorType];
        if (callbacks && callbacks.length > 0) {
            callbacks.forEach(function(item) {
                var callbackData = {
                    callbackName: item.callback,
                    result: JSON.stringify({
                        sensorType: sensorType,
                        data: data
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
mergeInto(LibraryManager.library, AppsInTossSensorsPlugin);