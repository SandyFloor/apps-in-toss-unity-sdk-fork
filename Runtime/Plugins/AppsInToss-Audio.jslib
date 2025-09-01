/**
 * Apps in Toss Audio Plugin for Unity WebGL
 * 오디오 시스템 - 음성, 음향, 배경음악 재생 관리
 * 
 * WeChat Mini Program의 wx.createInnerAudioContext API를 참고하여 구현
 */

var AppsInTossAudioPlugin = {
    // 오디오 컨텍스트 저장소
    audioContexts: {},
    audioIdCounter: 0,
    backgroundMusic: null,
    
    /**
     * 오디오 컨텍스트 생성
     * @param {string} options - 오디오 생성 옵션 JSON
     * @returns {number} 오디오 ID
     */
    aitCreateAudioContext: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        var audioId = ++AppsInTossAudioPlugin.audioIdCounter;
        
        console.log('[AIT Audio] Creating audio context:', audioId, options);
        
        // HTML5 Audio 객체 생성
        var audio = new Audio();
        var context = {
            id: audioId,
            audio: audio,
            options: options,
            state: 'idle', // idle, loading, playing, paused, stopped
            volume: 1.0,
            loop: false,
            currentTime: 0,
            duration: 0,
            gameObject: options.gameObject
        };
        
        // 이벤트 리스너 설정
        audio.addEventListener('loadstart', function() {
            context.state = 'loading';
            AppsInTossAudioPlugin.sendCallback(context, 'onLoadStart', { audioId: audioId });
        });
        
        audio.addEventListener('canplay', function() {
            context.duration = audio.duration || 0;
            AppsInTossAudioPlugin.sendCallback(context, 'onCanPlay', { 
                audioId: audioId, 
                duration: context.duration 
            });
        });
        
        audio.addEventListener('play', function() {
            context.state = 'playing';
            AppsInTossAudioPlugin.sendCallback(context, 'onPlay', { audioId: audioId });
        });
        
        audio.addEventListener('pause', function() {
            context.state = 'paused';
            AppsInTossAudioPlugin.sendCallback(context, 'onPause', { audioId: audioId });
        });
        
        audio.addEventListener('ended', function() {
            context.state = 'stopped';
            AppsInTossAudioPlugin.sendCallback(context, 'onEnded', { audioId: audioId });
        });
        
        audio.addEventListener('timeupdate', function() {
            context.currentTime = audio.currentTime;
            AppsInTossAudioPlugin.sendCallback(context, 'onTimeUpdate', { 
                audioId: audioId, 
                currentTime: context.currentTime,
                duration: context.duration 
            });
        });
        
        audio.addEventListener('error', function(e) {
            context.state = 'error';
            var errorMessage = 'Audio loading failed';
            if (e.target.error) {
                switch(e.target.error.code) {
                    case e.target.error.MEDIA_ERR_ABORTED:
                        errorMessage = 'Audio loading aborted';
                        break;
                    case e.target.error.MEDIA_ERR_NETWORK:
                        errorMessage = 'Network error';
                        break;
                    case e.target.error.MEDIA_ERR_DECODE:
                        errorMessage = 'Audio decode error';
                        break;
                    case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMessage = 'Audio format not supported';
                        break;
                }
            }
            
            AppsInTossAudioPlugin.sendCallback(context, 'onError', { 
                audioId: audioId, 
                error: errorMessage,
                errorCode: e.target.error ? e.target.error.code : -1
            });
        });
        
        AppsInTossAudioPlugin.audioContexts[audioId] = context;
        
        return audioId;
    },
    
    /**
     * 오디오 소스 설정
     */
    aitSetAudioSource: function(audioId, srcPtr) {
        var src = UTF8ToString(srcPtr);
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        console.log('[AIT Audio] Setting audio source:', audioId, src);
        
        context.audio.src = src;
        context.audio.load();
    },
    
    /**
     * 오디오 재생
     */
    aitPlayAudio: function(audioId) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        console.log('[AIT Audio] Playing audio:', audioId);
        
        context.audio.play().catch(function(error) {
            console.error('[AIT Audio] Play failed:', error);
            AppsInTossAudioPlugin.sendCallback(context, 'onError', { 
                audioId: audioId, 
                error: 'Play failed: ' + error.message,
                errorCode: -2
            });
        });
    },
    
    /**
     * 오디오 일시정지
     */
    aitPauseAudio: function(audioId) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        console.log('[AIT Audio] Pausing audio:', audioId);
        
        context.audio.pause();
    },
    
    /**
     * 오디오 정지
     */
    aitStopAudio: function(audioId) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        console.log('[AIT Audio] Stopping audio:', audioId);
        
        context.audio.pause();
        context.audio.currentTime = 0;
        context.state = 'stopped';
        context.currentTime = 0;
    },
    
    /**
     * 오디오 볼륨 설정
     */
    aitSetAudioVolume: function(audioId, volume) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        volume = Math.max(0, Math.min(1, volume));
        context.volume = volume;
        context.audio.volume = volume;
        
        console.log('[AIT Audio] Setting volume:', audioId, volume);
    },
    
    /**
     * 오디오 반복 설정
     */
    aitSetAudioLoop: function(audioId, loop) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        context.loop = loop;
        context.audio.loop = loop;
        
        console.log('[AIT Audio] Setting loop:', audioId, loop);
    },
    
    /**
     * 오디오 재생 위치 설정
     */
    aitSetAudioCurrentTime: function(audioId, time) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        if (context.audio.duration && time <= context.audio.duration) {
            context.audio.currentTime = time;
            context.currentTime = time;
            console.log('[AIT Audio] Setting current time:', audioId, time);
        }
    },
    
    /**
     * 오디오 재생 속도 설정
     */
    aitSetAudioPlaybackRate: function(audioId, rate) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        rate = Math.max(0.25, Math.min(4.0, rate)); // 0.25x ~ 4x 범위
        context.audio.playbackRate = rate;
        
        console.log('[AIT Audio] Setting playback rate:', audioId, rate);
    },
    
    /**
     * 오디오 상태 조회
     */
    aitGetAudioState: function(audioId) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return 0; // 0 = not found
        }
        
        // 상태를 숫자로 변환하여 반환
        switch(context.state) {
            case 'idle': return 1;
            case 'loading': return 2;
            case 'playing': return 3;
            case 'paused': return 4;
            case 'stopped': return 5;
            case 'error': return -1;
            default: return 0;
        }
    },
    
    /**
     * 오디오 정보 조회
     */
    aitGetAudioInfo: function(audioId) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return null;
        }
        
        var info = {
            audioId: audioId,
            state: context.state,
            currentTime: context.currentTime,
            duration: context.duration,
            volume: context.volume,
            loop: context.loop,
            playbackRate: context.audio.playbackRate,
            src: context.audio.src
        };
        
        AppsInTossAudioPlugin.sendCallback(context, 'onGetInfo', info);
    },
    
    /**
     * 오디오 컨텍스트 제거
     */
    aitDestroyAudio: function(audioId) {
        var context = AppsInTossAudioPlugin.audioContexts[audioId];
        
        if (!context) {
            console.error('[AIT Audio] Audio context not found:', audioId);
            return;
        }
        
        console.log('[AIT Audio] Destroying audio:', audioId);
        
        // 오디오 정지 및 정리
        context.audio.pause();
        context.audio.src = '';
        context.audio.load();
        
        delete AppsInTossAudioPlugin.audioContexts[audioId];
    },
    
    /**
     * 배경음악 재생 (전용 관리)
     */
    aitPlayBackgroundMusic: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Audio] Playing background music:', options);
        
        // 기존 배경음악 정지
        if (AppsInTossAudioPlugin.backgroundMusic) {
            AppsInTossAudioPlugin.backgroundMusic.pause();
        }
        
        // 새 배경음악 생성
        var bgm = new Audio();
        bgm.src = options.src;
        bgm.volume = options.volume || 0.5;
        bgm.loop = options.loop !== false; // 기본값 true
        
        bgm.addEventListener('canplay', function() {
            if (options.gameObject && options.onCanPlayCallback) {
                var callbackData = {
                    callbackName: options.onCanPlayCallback,
                    result: JSON.stringify({ success: true })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        });
        
        bgm.addEventListener('error', function(e) {
            if (options.gameObject && options.onErrorCallback) {
                var callbackData = {
                    callbackName: options.onErrorCallback,
                    result: JSON.stringify({ 
                        success: false, 
                        error: 'Background music loading failed' 
                    })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        });
        
        AppsInTossAudioPlugin.backgroundMusic = bgm;
        
        bgm.play().catch(function(error) {
            console.error('[AIT Audio] Background music play failed:', error);
            if (options.gameObject && options.onErrorCallback) {
                var callbackData = {
                    callbackName: options.onErrorCallback,
                    result: JSON.stringify({ 
                        success: false, 
                        error: 'Background music play failed: ' + error.message 
                    })
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        });
    },
    
    /**
     * 배경음악 일시정지
     */
    aitPauseBackgroundMusic: function() {
        console.log('[AIT Audio] Pausing background music');
        
        if (AppsInTossAudioPlugin.backgroundMusic) {
            AppsInTossAudioPlugin.backgroundMusic.pause();
        }
    },
    
    /**
     * 배경음악 재개
     */
    aitResumeBackgroundMusic: function() {
        console.log('[AIT Audio] Resuming background music');
        
        if (AppsInTossAudioPlugin.backgroundMusic) {
            AppsInTossAudioPlugin.backgroundMusic.play();
        }
    },
    
    /**
     * 배경음악 정지
     */
    aitStopBackgroundMusic: function() {
        console.log('[AIT Audio] Stopping background music');
        
        if (AppsInTossAudioPlugin.backgroundMusic) {
            AppsInTossAudioPlugin.backgroundMusic.pause();
            AppsInTossAudioPlugin.backgroundMusic.currentTime = 0;
        }
    },
    
    /**
     * 배경음악 볼륨 설정
     */
    aitSetBackgroundMusicVolume: function(volume) {
        volume = Math.max(0, Math.min(1, volume));
        
        console.log('[AIT Audio] Setting background music volume:', volume);
        
        if (AppsInTossAudioPlugin.backgroundMusic) {
            AppsInTossAudioPlugin.backgroundMusic.volume = volume;
        }
    },
    
    /**
     * 모든 오디오 일시정지 (앱이 백그라운드로 갈 때)
     */
    aitPauseAllAudio: function() {
        console.log('[AIT Audio] Pausing all audio');
        
        // 모든 오디오 컨텍스트 일시정지
        for (var audioId in AppsInTossAudioPlugin.audioContexts) {
            var context = AppsInTossAudioPlugin.audioContexts[audioId];
            if (context.state === 'playing') {
                context.audio.pause();
            }
        }
        
        // 배경음악도 일시정지
        if (AppsInTossAudioPlugin.backgroundMusic) {
            AppsInTossAudioPlugin.backgroundMusic.pause();
        }
    },
    
    /**
     * 모든 오디오 재개 (앱이 포그라운드로 올 때)
     */
    aitResumeAllAudio: function() {
        console.log('[AIT Audio] Resuming all audio');
        
        // 재생 중이던 오디오 컨텍스트만 재개
        for (var audioId in AppsInTossAudioPlugin.audioContexts) {
            var context = AppsInTossAudioPlugin.audioContexts[audioId];
            if (context.state === 'paused') {
                context.audio.play();
            }
        }
        
        // 배경음악도 재개
        if (AppsInTossAudioPlugin.backgroundMusic && AppsInTossAudioPlugin.backgroundMusic.paused) {
            AppsInTossAudioPlugin.backgroundMusic.play();
        }
    },
    
    /**
     * 콜백 전송 헬퍼 함수
     */
    sendCallback: function(context, callbackType, data) {
        if (context.gameObject && context.options[callbackType]) {
            var callbackData = {
                callbackName: context.options[callbackType],
                result: JSON.stringify(data)
            };
            SendMessage(context.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
        }
    }
};

// Unity에서 사용할 수 있도록 함수들을 전역에 등록
mergeInto(LibraryManager.library, AppsInTossAudioPlugin);