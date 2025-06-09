import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function SteamCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSteamUser } = useUser();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Đang xử lý đăng nhập Steam...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        
        // Check for success data
        const successData = searchParams.get('data');
        if (successData) {
          console.log('Steam authentication successful, processing user data');
          setMessage('Đăng nhập Steam thành công!');
          
          try {
            const userData = JSON.parse(decodeURIComponent(successData));
            console.log('Parsed user data:', userData);
            
            // Update user context
            if (setSteamUser) {
              setSteamUser(userData);
            }

            // Store user data and auth token in localStorage
            const { authToken, ...userDataWithoutToken } = userData;
            localStorage.setItem('westRoleplayUser', JSON.stringify(userDataWithoutToken));
            if (authToken) {
              localStorage.setItem('westRoleplayAuthToken', authToken);
            }
            
            setStatus('success');
            setMessage(`Chào mừng ${userData.steamUsername}! Đang chuyển hướng...`);
            
            // Get intended redirect destination
            const redirectTo = sessionStorage.getItem('steamAuthRedirect') || '/';
            sessionStorage.removeItem('steamAuthRedirect');
            
            // Redirect after a short delay
            setTimeout(() => {
              navigate(redirectTo);
            }, 2000);
            
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            throw new Error('Dữ liệu người dùng không hợp lệ');
          }
          
          return;
        }
        
        // Check for error
        const errorMessage = searchParams.get('message');
        if (errorMessage) {
          console.error('Steam authentication failed:', errorMessage);
          setStatus('error');
          setMessage(`Đăng nhập Steam thất bại: ${decodeURIComponent(errorMessage)}`);
          
          // Redirect to login page after delay
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent(errorMessage));
          }, 3000);
          
          return;
        }
        
        // No data or error found, this shouldn't happen
        console.error('Steam callback: No data or error found in URL');
        setStatus('error');
        setMessage('Không tìm thấy dữ liệu xác thực. Vui lòng thử lại.');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        
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
              className="w-16 h-16 mx-auto mb-4"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default SteamCallbackPage;
