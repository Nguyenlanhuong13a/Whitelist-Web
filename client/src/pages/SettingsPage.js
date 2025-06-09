import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getDiscordConfig, generateDiscordOAuthUrl } from '../utils/discordConfig';

function SettingsPage() {
  const { user, connectDiscord, disconnectDiscord, loading } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-clear messages after 10 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 15000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleConnectDiscord = async () => {
    try {
      setIsConnecting(true);
      setError('');
      setSuccess('');

      // Get Discord configuration using utility function
      const config = await getDiscordConfig();
      const discordAuthUrl = generateDiscordOAuthUrl(config.clientId, config.redirectUri, config.scope);

      console.log('Redirecting to Discord OAuth with client ID:', config.clientId);
      window.location.href = discordAuthUrl;
    } catch (err) {
      console.error('Discord connection error:', err);
      setError(err.message || 'Không thể kết nối với Discord. Vui lòng thử lại.');
      setIsConnecting(false);
    }
  };

  const handleDisconnectDiscord = async () => {
    try {
      setError('');
      setSuccess('');
      
      await disconnectDiscord();
      setSuccess('Đã ngắt kết nối Discord thành công!');
    } catch (err) {
      setError('Không thể ngắt kết nối Discord. Vui lòng thử lại.');
    }
  };

  // Handle Discord OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    console.log('OAuth callback params:', { code: !!code, error, errorDescription });

    if (error) {
      let errorMessage = 'Đăng nhập Discord bị hủy hoặc thất bại.';
      if (error === 'access_denied') {
        errorMessage = 'Bạn đã từ chối quyền truy cập Discord. Vui lòng thử lại và cho phép quyền truy cập.';
      } else if (errorDescription) {
        errorMessage = `Lỗi Discord: ${errorDescription}`;
      }

      setError(errorMessage);
      setIsConnecting(false);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code && !user?.discordId) {
      console.log('Processing Discord OAuth callback with code');
      setIsConnecting(true);
      setError('');
      setSuccess('');

      // Exchange code for user info
      connectDiscord(code)
        .then((userData) => {
          console.log('Discord connection completed successfully');
          setSuccess(`Kết nối Discord thành công! Chào mừng ${userData.user.discordUsername}!`);
          setIsConnecting(false);

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error('Discord connection failed:', err);
          setError(`Không thể hoàn tất kết nối Discord: ${err.message}`);
          setIsConnecting(false);

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, [connectDiscord, user?.discordId]);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
              {/* AWS-style Settings Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent">
                Cài đặt
              </h1>
              <p className="text-xl text-gray-400 mt-2 font-medium">Quản lý tài khoản và kết nối</p>
            </div>
          </div>
          
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-6">
            Kết nối tài khoản Discord của bạn để tự động điền thông tin khi đăng ký whitelist và kiểm tra lịch sử đơn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="glass rounded-lg p-4 border border-primary-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-sm font-semibold text-white">Đăng ký tự động</h4>
              </div>
              <p className="text-xs text-gray-400">Discord ID tự động điền trong form đăng ký whitelist</p>
            </div>

            <div className="glass rounded-lg p-4 border border-primary-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h4 className="text-sm font-semibold text-white">Kiểm tra nhanh</h4>
              </div>
              <p className="text-xs text-gray-400">Tự động tìm kiếm trạng thái đơn đăng ký của bạn</p>
            </div>

            <div className="glass rounded-lg p-4 border border-primary-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-semibold text-white">Lịch sử tức thì</h4>
              </div>
              <p className="text-xs text-gray-400">Xem ngay lịch sử tất cả đơn đăng ký của bạn</p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-8">
          {/* Discord Connection Card */}
          <div className="card-hover group">
            <div className="card-body">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  {/* Discord Icon */}
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Discord</h3>
                    <div className="flex items-center space-x-2">
                      {user?.discordId ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Đã kết nối
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Chưa kết nối
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-4">
                    {user?.discordId 
                      ? 'Bằng cách kết nối tài khoản Discord của bạn, bạn đồng ý chia sẻ thông tin với nền tảng của chúng tôi. Điều này giúp chúng tôi xác minh danh tính của bạn và liên lạc với bạn. Nếu bạn không muốn chia sẻ thông tin này nữa, vui lòng ngắt kết nối tài khoản của bạn.'
                      : 'Kết nối tài khoản Discord để tự động điền Discord ID khi đăng ký whitelist và kiểm tra lịch sử đơn.'
                    }
                  </p>
                  
                  {user?.discordId && (
                    <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.discordUsername || 'Discord User'}</p>
                          <p className="text-gray-400 text-sm font-mono">{user.discordId}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {user?.discordId ? (
                      <button
                        onClick={handleDisconnectDiscord}
                        disabled={loading}
                        className="btn-secondary group"
                      >
                        <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {loading ? 'Đang ngắt kết nối...' : 'Ngắt kết nối'}
                      </button>
                    ) : (
                      <button
                        onClick={handleConnectDiscord}
                        disabled={isConnecting || loading}
                        className="btn-primary group"
                      >
                        <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        {isConnecting ? 'Đang kết nối...' : 'Kết nối Discord'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-400 font-medium">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
