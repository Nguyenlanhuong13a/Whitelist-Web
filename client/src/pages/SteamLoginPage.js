import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SteamLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the intended destination from URL params - memoized to prevent useEffect dependency issues
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const redirectTo = useMemo(() => searchParams.get('redirect') || '/', [searchParams]);

  useEffect(() => {
    // Check if user is already authenticated
    const userData = localStorage.getItem('westRoleplayUser');
    const authToken = localStorage.getItem('westRoleplayAuthToken');

    if (userData && authToken) {
      try {
        const user = JSON.parse(userData);
        if (user.steamId) {
          // User is already authenticated, redirect to intended destination
          navigate(redirectTo);
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('westRoleplayUser');
        localStorage.removeItem('westRoleplayAuthToken');
      }
    }

    // Check for error in URL params
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [navigate, redirectTo, searchParams]);

  const handleSteamLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      console.log('Initiating Steam authentication');

      // Get Steam authentication URL from backend
      const response = await fetch('/api/auth/steam', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to initiate Steam authentication');
      }

      if (!data.redirectUrl) {
        throw new Error('No redirect URL received from server');
      }

      console.log('Redirecting to Steam:', data.redirectUrl);

      // Store the intended redirect destination
      sessionStorage.setItem('steamAuthRedirect', redirectTo);

      // Redirect to Steam authentication
      window.location.href = data.redirectUrl;

    } catch (err) {
      console.error('Steam login error:', err);
      setError(err.message || 'Không thể kết nối với Steam. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card p-8 text-center">
          <div className="mb-8">
            <img
              src="/west-logo.png"
              alt="West Roleplay Logo"
              className="w-20 h-20 mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-white mb-2">West Roleplay</h1>
            <p className="text-gray-400">Whitelist Registration System</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Đăng nhập bằng Steam
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Bạn cần đăng nhập bằng tài khoản Steam để truy cập hệ thống whitelist của West Roleplay.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSteamLogin}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang kết nối...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span>Đăng nhập bằng Steam</span>
              </div>
            )}
          </button>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-xs">
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <a href="/rules" className="text-primary-400 hover:text-primary-300 transition-colors">
                quy định
              </a>{' '}
              của West Roleplay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SteamLoginPage;
