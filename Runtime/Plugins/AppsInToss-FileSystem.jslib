/**
 * Apps in Toss File System Plugin for Unity WebGL
 * 파일 시스템 - 로컬 파일 읽기/쓰기, 캐시 관리
 * 
 * WeChat Mini Program의 wx.getFileSystemManager API를 참고하여 구현
 * Web 환경에서는 localStorage, IndexedDB, File API를 활용
 */

var AppsInTossFileSystemPlugin = {
    // 파일 시스템 설정
    fileSystemConfig: {
        maxFileSize: 100 * 1024 * 1024, // 100MB per file
        maxTotalSize: 200 * 1024 * 1024, // 200MB total storage
        userDataPath: '/AppsInToss/userData',
        cachePath: '/AppsInToss/cache',
        tempPath: '/AppsInToss/temp'
    },
    
    // 가상 파일 시스템 (메모리 기반)
    virtualFS: {},
    
    /**
     * 파일 시스템 매니저 초기화
     */
    aitInitFileSystem: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Initializing file system:', options);
        
        // IndexedDB 지원 확인
        if (window.indexedDB) {
            console.log('[AIT FileSystem] IndexedDB is supported');
        } else {
            console.log('[AIT FileSystem] IndexedDB not supported, using memory storage');
        }
        
        // 가상 디렉토리 구조 초기화
        AppsInTossFileSystemPlugin.virtualFS = {
            [AppsInTossFileSystemPlugin.fileSystemConfig.userDataPath]: {},
            [AppsInTossFileSystemPlugin.fileSystemConfig.cachePath]: {},
            [AppsInTossFileSystemPlugin.fileSystemConfig.tempPath]: {}
        };
        
        // 초기화 완료 콜백
        if (options.gameObject && options.onInitCallback) {
            var callbackData = {
                callbackName: options.onInitCallback,
                result: JSON.stringify({
                    success: true,
                    message: 'File system initialized',
                    userDataPath: AppsInTossFileSystemPlugin.fileSystemConfig.userDataPath,
                    cachePath: AppsInTossFileSystemPlugin.fileSystemConfig.cachePath,
                    tempPath: AppsInTossFileSystemPlugin.fileSystemConfig.tempPath
                })
            };
            SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
        }
    },
    
    /**
     * 파일 쓰기
     */
    aitWriteFile: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Writing file:', options.filePath);
        
        try {
            // 파일 크기 검증
            var dataSize = new Blob([options.data]).size;
            if (dataSize > AppsInTossFileSystemPlugin.fileSystemConfig.maxFileSize) {
                throw new Error('File size exceeds maximum limit (' + 
                    (AppsInTossFileSystemPlugin.fileSystemConfig.maxFileSize / 1024 / 1024) + 'MB)');
            }
            
            // 디렉토리 생성 (필요한 경우)
            var dirPath = AppsInTossFileSystemPlugin.getDirectoryPath(options.filePath);
            AppsInTossFileSystemPlugin.ensureDirectory(dirPath);
            
            // 파일 데이터 저장
            var fileInfo = {
                path: options.filePath,
                data: options.data,
                encoding: options.encoding || 'utf8',
                size: dataSize,
                modifiedTime: Date.now(),
                type: AppsInTossFileSystemPlugin.getFileType(options.filePath)
            };
            
            // localStorage에 저장 (작은 파일용)
            if (dataSize < 50 * 1024) { // 50KB 미만
                try {
                    localStorage.setItem('ait_file_' + options.filePath, JSON.stringify(fileInfo));
                    console.log('[AIT FileSystem] File saved to localStorage:', options.filePath);
                } catch (storageError) {
                    console.warn('[AIT FileSystem] localStorage full, using memory storage');
                    AppsInTossFileSystemPlugin.virtualFS[options.filePath] = fileInfo;
                }
            } else {
                // 큰 파일은 메모리에 저장 (실제로는 IndexedDB 사용 권장)
                AppsInTossFileSystemPlugin.virtualFS[options.filePath] = fileInfo;
                console.log('[AIT FileSystem] Large file saved to memory storage:', options.filePath);
            }
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                filePath: options.filePath,
                size: dataSize
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Write file error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 파일 읽기
     */
    aitReadFile: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Reading file:', options.filePath);
        
        try {
            var fileInfo = null;
            
            // localStorage에서 먼저 찾기
            try {
                var storedData = localStorage.getItem('ait_file_' + options.filePath);
                if (storedData) {
                    fileInfo = JSON.parse(storedData);
                }
            } catch (e) {
                console.warn('[AIT FileSystem] Error reading from localStorage:', e);
            }
            
            // localStorage에 없으면 메모리에서 찾기
            if (!fileInfo && AppsInTossFileSystemPlugin.virtualFS[options.filePath]) {
                fileInfo = AppsInTossFileSystemPlugin.virtualFS[options.filePath];
            }
            
            if (!fileInfo) {
                throw new Error('File not found: ' + options.filePath);
            }
            
            // 부분 읽기 지원 (position과 length 옵션)
            var data = fileInfo.data;
            if (options.position !== undefined || options.length !== undefined) {
                var startPos = options.position || 0;
                var endPos = options.length ? startPos + options.length : data.length;
                
                if (typeof data === 'string') {
                    data = data.substring(startPos, endPos);
                } else if (data instanceof ArrayBuffer) {
                    data = data.slice(startPos, endPos);
                }
            }
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                data: data,
                size: fileInfo.size,
                modifiedTime: fileInfo.modifiedTime
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Read file error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 파일 삭제
     */
    aitUnlinkFile: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Deleting file:', options.filePath);
        
        try {
            var fileExists = false;
            
            // localStorage에서 삭제
            try {
                if (localStorage.getItem('ait_file_' + options.filePath)) {
                    localStorage.removeItem('ait_file_' + options.filePath);
                    fileExists = true;
                }
            } catch (e) {
                console.warn('[AIT FileSystem] Error deleting from localStorage:', e);
            }
            
            // 메모리에서 삭제
            if (AppsInTossFileSystemPlugin.virtualFS[options.filePath]) {
                delete AppsInTossFileSystemPlugin.virtualFS[options.filePath];
                fileExists = true;
            }
            
            if (!fileExists) {
                throw new Error('File not found: ' + options.filePath);
            }
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                filePath: options.filePath
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Delete file error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 파일 복사
     */
    aitCopyFile: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Copying file:', options.srcPath, 'to', options.destPath);
        
        try {
            // 원본 파일 읽기
            var srcFileInfo = null;
            
            try {
                var storedData = localStorage.getItem('ait_file_' + options.srcPath);
                if (storedData) {
                    srcFileInfo = JSON.parse(storedData);
                }
            } catch (e) {}
            
            if (!srcFileInfo && AppsInTossFileSystemPlugin.virtualFS[options.srcPath]) {
                srcFileInfo = AppsInTossFileSystemPlugin.virtualFS[options.srcPath];
            }
            
            if (!srcFileInfo) {
                throw new Error('Source file not found: ' + options.srcPath);
            }
            
            // 대상 파일 생성
            var destFileInfo = {
                path: options.destPath,
                data: srcFileInfo.data,
                encoding: srcFileInfo.encoding,
                size: srcFileInfo.size,
                modifiedTime: Date.now(),
                type: AppsInTossFileSystemPlugin.getFileType(options.destPath)
            };
            
            // 저장
            if (destFileInfo.size < 50 * 1024) {
                try {
                    localStorage.setItem('ait_file_' + options.destPath, JSON.stringify(destFileInfo));
                } catch (e) {
                    AppsInTossFileSystemPlugin.virtualFS[options.destPath] = destFileInfo;
                }
            } else {
                AppsInTossFileSystemPlugin.virtualFS[options.destPath] = destFileInfo;
            }
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                srcPath: options.srcPath,
                destPath: options.destPath
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Copy file error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 파일 정보 조회
     */
    aitGetFileStats: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Getting file stats:', options.filePath);
        
        try {
            var fileInfo = null;
            
            // 파일 찾기
            try {
                var storedData = localStorage.getItem('ait_file_' + options.filePath);
                if (storedData) {
                    fileInfo = JSON.parse(storedData);
                }
            } catch (e) {}
            
            if (!fileInfo && AppsInTossFileSystemPlugin.virtualFS[options.filePath]) {
                fileInfo = AppsInTossFileSystemPlugin.virtualFS[options.filePath];
            }
            
            if (!fileInfo) {
                throw new Error('File not found: ' + options.filePath);
            }
            
            // 파일 통계 정보
            var stats = {
                path: fileInfo.path,
                size: fileInfo.size,
                modifiedTime: fileInfo.modifiedTime,
                isFile: true,
                isDirectory: false,
                type: fileInfo.type || 'unknown'
            };
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                stats: stats
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Get file stats error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 디렉토리 생성
     */
    aitMkDir: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Creating directory:', options.dirPath);
        
        try {
            AppsInTossFileSystemPlugin.ensureDirectory(options.dirPath);
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                dirPath: options.dirPath
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Create directory error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 디렉토리 내용 읽기
     */
    aitReadDir: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Reading directory:', options.dirPath);
        
        try {
            var files = [];
            var targetDir = options.dirPath.endsWith('/') ? options.dirPath : options.dirPath + '/';
            
            // localStorage에서 파일들 찾기
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.startsWith('ait_file_')) {
                    var filePath = key.substring('ait_file_'.length);
                    if (filePath.startsWith(targetDir)) {
                        var relativePath = filePath.substring(targetDir.length);
                        if (relativePath.indexOf('/') === -1) { // 직계 자식만
                            files.push(relativePath);
                        }
                    }
                }
            }
            
            // 메모리 파일들도 확인
            for (var path in AppsInTossFileSystemPlugin.virtualFS) {
                if (path.startsWith(targetDir)) {
                    var relativePath = path.substring(targetDir.length);
                    if (relativePath.indexOf('/') === -1 && files.indexOf(relativePath) === -1) {
                        files.push(relativePath);
                    }
                }
            }
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                files: files,
                dirPath: options.dirPath
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Read directory error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 저장소 정보 조회
     */
    aitGetStorageInfo: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Getting storage info');
        
        try {
            var usedSize = 0;
            var fileCount = 0;
            
            // localStorage 사용량 계산
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.startsWith('ait_file_')) {
                    try {
                        var fileInfo = JSON.parse(localStorage.getItem(key));
                        usedSize += fileInfo.size || 0;
                        fileCount++;
                    } catch (e) {}
                }
            }
            
            // 메모리 사용량 추가
            for (var path in AppsInTossFileSystemPlugin.virtualFS) {
                var fileInfo = AppsInTossFileSystemPlugin.virtualFS[path];
                if (fileInfo && fileInfo.size) {
                    usedSize += fileInfo.size;
                    fileCount++;
                }
            }
            
            var storageInfo = {
                usedSize: usedSize,
                maxSize: AppsInTossFileSystemPlugin.fileSystemConfig.maxTotalSize,
                availableSize: AppsInTossFileSystemPlugin.fileSystemConfig.maxTotalSize - usedSize,
                fileCount: fileCount,
                usagePercent: Math.round((usedSize / AppsInTossFileSystemPlugin.fileSystemConfig.maxTotalSize) * 100)
            };
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                storageInfo: storageInfo
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Get storage info error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 캐시 파일 정리
     */
    aitClearCache: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT FileSystem] Clearing cache files');
        
        try {
            var clearedCount = 0;
            var clearedSize = 0;
            var cachePrefix = 'ait_file_' + AppsInTossFileSystemPlugin.fileSystemConfig.cachePath;
            
            // localStorage 캐시 파일 삭제
            var keysToRemove = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.startsWith(cachePrefix)) {
                    try {
                        var fileInfo = JSON.parse(localStorage.getItem(key));
                        clearedSize += fileInfo.size || 0;
                        keysToRemove.push(key);
                        clearedCount++;
                    } catch (e) {}
                }
            }
            
            keysToRemove.forEach(function(key) {
                localStorage.removeItem(key);
            });
            
            // 메모리 캐시 파일 삭제
            for (var path in AppsInTossFileSystemPlugin.virtualFS) {
                if (path.startsWith(AppsInTossFileSystemPlugin.fileSystemConfig.cachePath)) {
                    var fileInfo = AppsInTossFileSystemPlugin.virtualFS[path];
                    if (fileInfo && fileInfo.size) {
                        clearedSize += fileInfo.size;
                        clearedCount++;
                    }
                    delete AppsInTossFileSystemPlugin.virtualFS[path];
                }
            }
            
            // 성공 콜백
            AppsInTossFileSystemPlugin.sendCallback(options, 'onSuccess', {
                success: true,
                clearedCount: clearedCount,
                clearedSize: clearedSize
            });
            
        } catch (error) {
            console.error('[AIT FileSystem] Clear cache error:', error);
            
            AppsInTossFileSystemPlugin.sendCallback(options, 'onFail', {
                success: false,
                error: error.message,
                errorCode: -1
            });
        }
    },
    
    /**
     * 헬퍼 함수들
     */
    
    getDirectoryPath: function(filePath) {
        var lastSlashIndex = filePath.lastIndexOf('/');
        return lastSlashIndex > 0 ? filePath.substring(0, lastSlashIndex) : '/';
    },
    
    ensureDirectory: function(dirPath) {
        // 웹 환경에서는 가상 디렉토리만 생성
        if (!AppsInTossFileSystemPlugin.virtualFS[dirPath]) {
            AppsInTossFileSystemPlugin.virtualFS[dirPath] = {};
        }
    },
    
    getFileType: function(filePath) {
        var extension = filePath.split('.').pop().toLowerCase();
        var typeMap = {
            'txt': 'text',
            'json': 'json',
            'js': 'javascript',
            'html': 'html',
            'css': 'css',
            'png': 'image',
            'jpg': 'image',
            'jpeg': 'image',
            'gif': 'image',
            'svg': 'image',
            'mp3': 'audio',
            'wav': 'audio',
            'mp4': 'video',
            'webm': 'video'
        };
        return typeMap[extension] || 'binary';
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
mergeInto(LibraryManager.library, AppsInTossFileSystemPlugin);