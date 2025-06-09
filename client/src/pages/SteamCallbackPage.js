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
            setMessage(`Chào mừng ${userData.steamUsername}! Đang chuyển hướng...`);

            // Get intended redirect destination
            const redirectTo = sessionStorage.getItem('steamAuthRedirect') || '/';
            console.log('✅ Redirect destination:', redirectTo);

            // Set debug info for display
            setDebugInfo({
              redirectTo,
              userDataReceived: true,
              steamId: userData.steamId,
              timestamp: new Date().toISOString()
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

            // Verify user context has been updated
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

            // Redirect after a short delay with countdown
            let countdown = 2;
            const countdownInterval = setInterval(() => {
              countdown--;
              setMessage(`Chào mừng ${userData.steamUsername}! Đang chuyển hướng trong ${countdown}s...`);

              if (countdown <= 0) {
                clearInterval(countdownInterval);

                // Verify user context before navigation
                if (!verifyUserContext()) {
                  console.warn('⚠️ User context not yet updated, forcing localStorage update');
                  localStorage.setItem('westRoleplayUser', JSON.stringify(userData));
                  if (userData.authToken) {
                    localStorage.setItem('westRoleplayAuthToken', userData.authToken);
                  }
                }

                console.log('🚀 Executing navigation to:', redirectTo);

                try {
                  // Try React Router navigation first
                  navigate(redirectTo, { replace: true });
                  console.log('✅ React Router navigation completed');

                  // Add a backup navigation after a short delay
                  setTimeout(() => {
                    if (window.location.pathname === '/auth/steam/callback') {
                      console.log('🔄 React Router navigation may have failed, using window.location');
                      window.location.replace(redirectTo);
                    }
                  }, 500);

                } catch (navError) {
                  console.error('❌ React Router navigation failed:', navError);
                  // Fallback to window.location immediately
                  console.log('🔄 Falling back to window.location.replace');
                  window.location.replace(redirectTo);
                }
              }
            }, 1000);

            // Store cleanup function for later use
            const cleanup = () => clearInterval(countdownInterval);

            // Set a timeout to cleanup if component unmounts
            setTimeout(() => {
              if (countdownInterval) {
                cleanup();
              }
            }, 5000);

          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
            console.error('Raw data that failed to parse:', successData);
            throw new Error('Dữ liệu người dùng không hợp lệ');
          }

          return;
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

          return;
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
        
      } catch (error) {
        console.error('Steam callback processing error:', error);
        setStatus('error');
        setMessage(`Lỗi xử lý đăng nhập: ${error.message}`);
        
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent(error.message));
        }, 3000);
      }
    };

    handleCallback();
  }, [location, navigate, setSteamUser]);

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
                  onClick={() => {
                    const redirectTo = sessionStorage.getItem('steamAuthRedirect') || '/';
                    console.log('🔘 Manual redirect to:', redirectTo);

                    try {
                      navigate(redirectTo, { replace: true });
                      console.log('✅ Manual navigation completed');
                    } catch (error) {
                      console.error('❌ Manual navigation failed:', error);
                      window.location.replace(redirectTo);
                    }
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Tiếp tục ngay
                </button>

                <div className="text-xs text-gray-400">
                  Hoặc đợi tự động chuyển hướng
                </div>
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
                  <div>Navigate Function: {typeof navigate === 'function' ? '✅' : '❌'}</div>
                  <div>Location: {window.location.href}</div>
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
