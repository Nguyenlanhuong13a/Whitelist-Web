import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function DiscordCallbackPage() {
  const navigate = useNavigate();
  const { connectDiscord } = useUser();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Đang xử lý kết nối Discord...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const state = urlParams.get('state');

        console.log('Discord OAuth callback params:', {
          code: !!code,
          error,
          errorDescription,
          state: !!state
        });

        // Validate state parameter if present (optional for now, but good for security)
        if (state) {
          try {
            const stateData = JSON.parse(atob(decodeURIComponent(state)));
            console.log('State validation:', {
              timestamp: stateData.timestamp,
              origin: stateData.origin,
              currentOrigin: window.location.origin
            });
          } catch (stateError) {
            console.warn('Invalid state parameter:', stateError);
          }
        }

        // Handle OAuth errors
        if (error) {
          console.error('Discord OAuth error:', error, errorDescription);
          setStatus('error');
          
          if (error === 'access_denied') {
            setMessage('Bạn đã từ chối quyền truy cập Discord. Vui lòng thử lại nếu muốn kết nối.');
          } else {
            setMessage(`Lỗi Discord OAuth: ${errorDescription || error}`);
          }
          
          // Redirect to settings after 3 seconds
          setTimeout(() => {
            navigate('/settings?discord_error=' + encodeURIComponent(errorDescription || error));
          }, 3000);
          return;
        }

        // Handle missing authorization code
        if (!code) {
          console.error('No authorization code received');
          setStatus('error');
          setMessage('Không nhận được mã xác thực từ Discord. Vui lòng thử lại.');
          
          setTimeout(() => {
            navigate('/settings?discord_error=no_code');
          }, 3000);
          return;
        }

        // Process the authorization code
        console.log('Processing Discord OAuth callback with code');
        setMessage('Đang kết nối với Discord...');

        const userData = await connectDiscord(code);
        console.log('Discord connection completed successfully');

        setStatus('success');
        setMessage(`Kết nối Discord thành công! Chào mừng ${userData.user.discordUsername}!`);

        // Wait a bit longer to ensure state has fully propagated
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to settings with success message after 1.5 seconds (reduced from 2)
        setTimeout(() => {
          navigate('/settings?discord_success=true&username=' + encodeURIComponent(userData.user.discordUsername));
        }, 1500);

      } catch (err) {
        console.error('Discord connection failed:', err);
        setStatus('error');
        setMessage(`Không thể hoàn tất kết nối Discord: ${err.message}`);
        
        // Redirect to settings with error after 3 seconds
        setTimeout(() => {
          navigate('/settings?discord_error=' + encodeURIComponent(err.message));
        }, 3000);
      }
    };

    handleCallback();
  }, [connectDiscord, navigate]);

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
            <h1 className="text-2xl font-bold text-white mb-2">Discord OAuth</h1>
          </div>

          <div className="mb-6">
            {status === 'processing' && (
              <div className="flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            )}

            <p className="text-gray-300">{message}</p>
          </div>

          <div className="text-sm text-gray-400">
            {status === 'processing' && 'Vui lòng đợi...'}
            {status === 'success' && 'Đang chuyển hướng về trang cài đặt...'}
            {status === 'error' && 'Sẽ chuyển hướng về trang cài đặt sau ít giây...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscordCallbackPage;
