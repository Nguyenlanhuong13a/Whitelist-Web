import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function SteamCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSteamUser, user, checkSteamAuth } = useUser();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Đang xử lý đăng nhập Steam...');
  const [debugInfo, setDebugInfo] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Monitor user context changes
  useEffect(() => {
    if (user) {
      console.log('👤 User context updated:', {
        steamId: user.steamId,
        steamUsername: user.steamUsername,
        isAuthenticated: checkSteamAuth()
      });
    }
  }, [user, checkSteamAuth]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('=== Steam Callback Processing Started ===');
        console.log('Current URL:', window.location.href);
        console.log('Location search:', location.search);

        const searchParams = new URLSearchParams(location.search);
        console.log('Search params entries:', Object.fromEntries(searchParams.entries()));

        // Check for success data
        const successData = searchParams.get('data');
        if (successData) {
          console.log('✅ Steam authentication successful, processing user data');
          console.log('Raw success data length:', successData.length);
          setMessage('Đăng nhập Steam thành công!');

          try {
            const userData = JSON.parse(decodeURIComponent(successData));
            console.log('✅ Parsed user data successfully:', {
              steamId: userData.steamId,
              steamUsername: userData.steamUsername,
              hasAuthToken: !!userData.authToken
            });

            // Update user context (this will also handle localStorage storage)
            if (setSteamUser) {
              console.log('✅ Calling setSteamUser...');
              setSteamUser(userData);
              console.log('✅ setSteamUser completed');

              // Wait a bit for the context to update
              await new Promise(resolve => setTimeout(resolve, 100));
              console.log('✅ Context update delay completed');
            } else {
              console.error('❌ setSteamUser function not available');
            }

            setStatus('success');
            setMessage(`Chào mừng ${userData.steamUsername}! Đang chuẩn bị chuyển hướng...`);

            // Get intended redirect destination
            const redirectTo = sessionStorage.getItem('steamAuthRedirect') || '/';
            console.log('✅ Redirect destination:', redirectTo);

            // Set debug info for display
            setDebugInfo({
              redirectTo,
              userDataReceived: true,
              steamId: userData.steamId,
              timestamp: new Date().toISOString(),
              navigateAvailable: typeof navigate === 'function',
              windowLocationAvailable: typeof window !== 'undefined' && !!window.location
            });

            sessionStorage.removeItem('steamAuthRedirect');

            // Add immediate redirect option for testing
            const urlParams = new URLSearchParams(location.search);
            const immediateRedirect = urlParams.get('immediate');

            if (immediateRedirect === 'true') {
              console.log('🚀 Immediate redirect requested');
              navigate(redirectTo);
              return;
            }

            // Create a robust navigation function
            const performNavigation = async (destination) => {
              console.log('🚀 Starting navigation to:', destination);
              setIsRedirecting(true);

              // Verify user context before navigation
              const verifyUserContext = () => {
                const storedUser = localStorage.getItem('westRoleplayUser');
                if (storedUser) {
                  try {
                    const parsedUser = JSON.parse(storedUser);
                    return parsedUser.steamId === userData.steamId;
                  } catch (e) {
                    return false;
                  }
                }
                return false;
              };

              if (!verifyUserContext()) {
                console.warn('⚠️ User context not yet updated, forcing localStorage update');
                localStorage.setItem('westRoleplayUser', JSON.stringify(userData));
                if (userData.authToken) {
                  localStorage.setItem('westRoleplayAuthToken', userData.authToken);
                }
              }

              // Try multiple navigation methods
              let navigationSuccessful = false;

              // Method 1: React Router navigate
              try {
                console.log('🔄 Attempting React Router navigation...');
                navigate(destination, { replace: true });
                console.log('✅ React Router navigation initiated');

                // Check if navigation actually happened after a short delay
                setTimeout(() => {
                  if (window.location.pathname === '/auth/steam/callback') {
                    console.log('⚠️ Still on callback page, trying window.location');
                    window.location.replace(destination);
                  } else {
                    console.log('✅ Navigation successful via React Router');
                    navigationSuccessful = true;
                  }
                }, 300);

              } catch (navError) {
                console.error('❌ React Router navigation failed:', navError);
              }

              // Method 2: Immediate window.location fallback
              setTimeout(() => {
                if (!navigationSuccessful && window.location.pathname === '/auth/steam/callback') {
                  console.log('🔄 Using window.location.replace as fallback');
                  try {
                    window.location.replace(destination);
                  } catch (error) {
                    console.error('❌ window.location.replace failed:', error);
                    // Method 3: Last resort - window.location.href
                    console.log('🔄 Last resort: window.location.href');
                    window.location.href = destination;
                  }
                }
              }, 600);
            };

            // Start countdown with visual feedback
            let countdownValue = 3;
            setCountdown(countdownValue);
            setMessage(`Chào mừng ${userData.steamUsername}! Đang chuyển hướng trong ${countdownValue}s...`);

            const countdownInterval = setInterval(() => {
              countdownValue--;
              setCountdown(countdownValue);

              if (countdownValue > 0) {
                setMessage(`Chào mừng ${userData.steamUsername}! Đang chuyển hướng trong ${countdownValue}s...`);
              } else {
                setMessage(`Chào mừng ${userData.steamUsername}! Đang chuyển hướng...`);
                clearInterval(countdownInterval);

                // Execute navigation
                performNavigation(redirectTo);
              }
            }, 1000);

            // Store cleanup function to return later
            const cleanupFunction = () => {
              if (countdownInterval) {
                clearInterval(countdownInterval);
              }
            };

            // Return cleanup function for this success case
            return cleanupFunction;

          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
            console.error('Raw data that failed to parse:', successData);
            throw new Error('Dữ liệu người dùng không hợp lệ');
          }
        }
        }

        // Check for error
        const errorMessage = searchParams.get('error');
        if (errorMessage) {
          console.error('Steam authentication failed:', errorMessage);
          setStatus('error');
          const decodedError = decodeURIComponent(errorMessage);
          setMessage(decodedError);

          // Redirect to login page after delay
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent(decodedError));
          }, 4000);

          return () => {}; // Return empty cleanup function
        }

        // No data or error found, this shouldn't happen
        console.error('Steam callback: No data or error found in URL');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', Object.fromEntries(searchParams.entries()));

        setStatus('error');
        setMessage('Không tìm thấy dữ liệu xác thực từ Steam. Có thể do phiên đăng nhập đã hết hạn hoặc bị gián đoạn. Vui lòng thử đăng nhập lại.');

        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent('Phiên đăng nhập Steam bị gián đoạn'));
        }, 4000);

        return () => {}; // Return empty cleanup function
        
      } catch (error) {
        console.error('Steam callback processing error:', error);
        setStatus('error');
        setMessage(`Lỗi xử lý đăng nhập: ${error.message}`);

        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent(error.message));
        }, 3000);

        return () => {}; // Return empty cleanup function
      }
    };

    const cleanup = handleCallback();

    // Return cleanup function for useEffect
    return cleanup;
  }, [location, navigate, setSteamUser, user, checkSteamAuth]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-300';
      case 'error':
        return 'text-red-300';
      default:
        return 'text-blue-300';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card p-8 text-center">
          <div className="mb-6">
            <img
              src="/west-logo.png"
              alt="West Roleplay Logo"
              className="w-12 h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white mb-2">Steam Authentication</h1>
          </div>

          <div className="flex flex-col items-center">
            {getStatusIcon()}
            
            <p className={`text-lg font-medium ${getStatusColor()} mb-4`}>
              {message}
            </p>
            
            {status === 'processing' && (
              <p className="text-gray-400 text-sm">
                Vui lòng đợi trong giây lát...
              </p>
            )}

            {status === 'success' && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={async () => {
                    const redirectTo = sessionStorage.getItem('steamAuthRedirect') || '/';
                    console.log('🔘 Manual redirect initiated to:', redirectTo);

                    setIsRedirecting(true);
                    setMessage('Đang chuyển hướng...');

                    // Use the same robust navigation logic
                    try {
                      console.log('🔄 Manual navigation attempt 1: React Router');
                      navigate(redirectTo, { replace: true });

                      // Check if navigation worked
                      setTimeout(() => {
                        if (window.location.pathname === '/auth/steam/callback') {
                          console.log('🔄 Manual navigation attempt 2: window.location.replace');
                          window.location.replace(redirectTo);
                        }
                      }, 200);

                    } catch (error) {
                      console.error('❌ Manual React Router navigation failed:', error);
                      console.log('🔄 Manual navigation fallback: window.location.replace');
                      try {
                        window.location.replace(redirectTo);
                      } catch (fallbackError) {
                        console.error('❌ Manual window.location.replace failed:', fallbackError);
                        console.log('🔄 Manual navigation last resort: window.location.href');
                        window.location.href = redirectTo;
                      }
                    }
                  }}
                  disabled={isRedirecting}
                  className={`px-6 py-2 ${isRedirecting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors`}
                >
                  {isRedirecting ? 'Đang chuyển hướng...' : 'Tiếp tục ngay'}
                </button>

                {!isRedirecting && countdown !== null && (
                  <div className="text-xs text-gray-400">
                    Hoặc đợi tự động chuyển hướng ({countdown}s)
                  </div>
                )}

                {isRedirecting && (
                  <div className="text-xs text-yellow-400">
                    Đang thực hiện chuyển hướng...
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Debug Information (only show in development or when needed) */}
            {(process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true')) && debugInfo && (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Debug Info:</h3>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Redirect To: {debugInfo.redirectTo}</div>
                  <div>User Data: {debugInfo.userDataReceived ? '✅' : '❌'}</div>
                  <div>Steam ID: {debugInfo.steamId}</div>
                  <div>Timestamp: {debugInfo.timestamp}</div>
                  <div>Navigate Function: {debugInfo.navigateAvailable ? '✅' : '❌'}</div>
                  <div>Window Location: {debugInfo.windowLocationAvailable ? '✅' : '❌'}</div>
                  <div>Current Path: {window.location.pathname}</div>
                  <div>Is Redirecting: {isRedirecting ? '✅' : '❌'}</div>
                  <div>Countdown: {countdown !== null ? countdown : 'N/A'}</div>
                  <div>Status: {status}</div>
                  <div>User Context: {user?.steamId ? '✅' : '❌'}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-600">
                  <button
                    onClick={() => {
                      console.log('=== MANUAL DEBUG NAVIGATION TEST ===');
                      console.log('Current location:', window.location.href);
                      console.log('Navigate function:', typeof navigate);
                      console.log('User context:', user);
                      console.log('Attempting direct navigation to home...');
                      try {
                        navigate('/', { replace: true });
                        console.log('Direct navigation initiated');
                      } catch (error) {
                        console.error('Direct navigation failed:', error);
                        window.location.replace('/');
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                  >
                    Test Direct Navigation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SteamCallbackPage;
