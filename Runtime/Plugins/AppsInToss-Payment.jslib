/**
 * Apps in Toss Payment Plugin for Unity WebGL
 * 토스페이먼츠를 사용한 결제 기능
 */

var AppsInTossPaymentPlugin = {
    // 토스페이먼츠 위젯 인스턴스
    paymentWidget: null,
    clientKey: null,
    customerKey: null,
    
    // 초기화
    aitInitPayment: function(clientKeyPtr, customerKeyPtr) {
        var clientKey = UTF8ToString(clientKeyPtr);
        var customerKey = UTF8ToString(customerKeyPtr);
        
        console.log('[AIT Payment] Initializing payment with client key:', clientKey);
        
        if (typeof PaymentWidget !== 'undefined') {
            try {
                AppsInTossPaymentPlugin.clientKey = clientKey;
                AppsInTossPaymentPlugin.customerKey = customerKey;
                AppsInTossPaymentPlugin.paymentWidget = PaymentWidget(clientKey, customerKey);
                console.log('[AIT Payment] Payment widget initialized successfully');
                return 1; // 성공
            } catch (error) {
                console.error('[AIT Payment] Failed to initialize payment widget:', error);
                return 0; // 실패
            }
        } else {
            console.error('[AIT Payment] PaymentWidget is not available');
            return 0;
        }
    },
    
    // 결제 요청
    aitRequestPayment: function(optionsPtr) {
        var optionsStr = UTF8ToString(optionsPtr);
        var options = JSON.parse(optionsStr);
        
        console.log('[AIT Payment] Requesting payment:', options);
        
        if (!AppsInTossPaymentPlugin.paymentWidget) {
            console.error('[AIT Payment] Payment widget is not initialized');
            return;
        }
        
        try {
            // 결제 정보 설정
            var paymentData = {
                amount: options.amount,
                orderId: options.orderId,
                orderName: options.productName,
                customerName: options.customerName || '고객',
                customerEmail: options.customerEmail || '',
                successUrl: window.location.origin + '/payment/success',
                failUrl: window.location.origin + '/payment/fail'
            };
            
            // 결제 요청
            AppsInTossPaymentPlugin.paymentWidget.requestPayment('카드', paymentData).then(function(result) {
                console.log('[AIT Payment] Payment success:', result);
                
                var paymentResult = {
                    success: true,
                    paymentKey: result.paymentKey,
                    orderId: result.orderId,
                    amount: result.amount,
                    status: 'SUCCESS',
                    approvedAt: new Date().toISOString()
                };
                
                // Unity로 성공 콜백 전송
                if (options.successCallback && options.gameObject) {
                    var callbackData = {
                        callbackName: options.successCallback,
                        result: JSON.stringify(paymentResult)
                    };
                    SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
                }
            }).catch(function(error) {
                console.error('[AIT Payment] Payment error:', error);
                
                if (error.code === 'USER_CANCEL') {
                    // 사용자 취소
                    if (options.cancelCallback && options.gameObject) {
                        var callbackData = {
                            callbackName: options.cancelCallback,
                            result: JSON.stringify({ cancelled: true })
                        };
                        SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
                    }
                } else {
                    // 결제 실패
                    var failureResult = {
                        success: false,
                        message: error.message || 'Payment failed',
                        errorCode: error.code || -1
                    };
                    
                    if (options.failureCallback && options.gameObject) {
                        var callbackData = {
                            callbackName: options.failureCallback,
                            result: JSON.stringify(failureResult)
                        };
                        SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
                    }
                }
            });
        } catch (error) {
            console.error('[AIT Payment] Exception during payment request:', error);
            
            var failureResult = {
                success: false,
                message: error.message || 'Payment request failed',
                errorCode: -1
            };
            
            if (options.failureCallback && options.gameObject) {
                var callbackData = {
                    callbackName: options.failureCallback,
                    result: JSON.stringify(failureResult)
                };
                SendMessage(options.gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }
    },
    
    // 결제 검증
    aitVerifyPayment: function(paymentKeyPtr, orderIdPtr, amountPtr, gameObjectPtr, callbackPtr) {
        var paymentKey = UTF8ToString(paymentKeyPtr);
        var orderId = UTF8ToString(orderIdPtr);
        var amount = UTF8ToString(amountPtr);
        var gameObject = UTF8ToString(gameObjectPtr);
        var callback = UTF8ToString(callbackPtr);
        
        console.log('[AIT Payment] Verifying payment:', { paymentKey, orderId, amount });
        
        // 서버에 결제 검증 요청
        fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentKey: paymentKey,
                orderId: orderId,
                amount: parseInt(amount)
            })
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            console.log('[AIT Payment] Payment verification result:', result);
            
            if (callback && gameObject) {
                var callbackData = {
                    callbackName: callback,
                    result: JSON.stringify(result)
                };
                SendMessage(gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }).catch(function(error) {
            console.error('[AIT Payment] Payment verification failed:', error);
            
            var failureResult = {
                success: false,
                message: 'Payment verification failed',
                errorCode: -1
            };
            
            if (callback && gameObject) {
                var callbackData = {
                    callbackName: callback,
                    result: JSON.stringify(failureResult)
                };
                SendMessage(gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        });
    },
    
    // 결제 내역 조회
    aitGetPaymentHistory: function(gameObjectPtr, callbackPtr) {
        var gameObject = UTF8ToString(gameObjectPtr);
        var callback = UTF8ToString(callbackPtr);
        
        console.log('[AIT Payment] Getting payment history');
        
        // 서버에서 결제 내역 조회
        fetch('/api/payment/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            console.log('[AIT Payment] Payment history:', result);
            
            if (callback && gameObject) {
                var callbackData = {
                    callbackName: callback,
                    result: JSON.stringify(result)
                };
                SendMessage(gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }).catch(function(error) {
            console.error('[AIT Payment] Failed to get payment history:', error);
            
            var failureResult = {
                success: false,
                message: 'Failed to get payment history',
                errorCode: -1,
                payments: []
            };
            
            if (callback && gameObject) {
                var callbackData = {
                    callbackName: callback,
                    result: JSON.stringify(failureResult)
                };
                SendMessage(gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        });
    },
    
    // 결제 취소
    aitCancelPayment: function(paymentKeyPtr, cancelReasonPtr, gameObjectPtr, callbackPtr) {
        var paymentKey = UTF8ToString(paymentKeyPtr);
        var cancelReason = UTF8ToString(cancelReasonPtr);
        var gameObject = UTF8ToString(gameObjectPtr);
        var callback = UTF8ToString(callbackPtr);
        
        console.log('[AIT Payment] Cancelling payment:', { paymentKey, cancelReason });
        
        // 서버에 결제 취소 요청
        fetch('/api/payment/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentKey: paymentKey,
                cancelReason: cancelReason
            })
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            console.log('[AIT Payment] Payment cancellation result:', result);
            
            if (callback && gameObject) {
                var callbackData = {
                    callbackName: callback,
                    result: JSON.stringify(result)
                };
                SendMessage(gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        }).catch(function(error) {
            console.error('[AIT Payment] Payment cancellation failed:', error);
            
            var failureResult = {
                success: false,
                message: 'Payment cancellation failed',
                errorCode: -1
            };
            
            if (callback && gameObject) {
                var callbackData = {
                    callbackName: callback,
                    result: JSON.stringify(failureResult)
                };
                SendMessage(gameObject, 'OnAITCallback', JSON.stringify(callbackData));
            }
        });
    }
};

// Unity에서 사용할 수 있도록 함수들을 전역에 등록
mergeInto(LibraryManager.library, AppsInTossPaymentPlugin);