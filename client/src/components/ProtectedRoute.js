import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function ProtectedRoute({ children }) {
  const { user, loading, checkSteamAuth } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      // Wait for user context to finish loading
      if (loading) {
        return;
      }

      // Check if user is authenticated with Steam
      if (!checkSteamAuth()) {
        console.log('Steam authentication required, redirecting to login');
        const currentPath = location.pathname + location.search;
        navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      // User is authenticated
      setIsChecking(false);
    };

    checkAuthentication();
  }, [user, loading, checkSteamAuth, navigate, location]);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <img
              src="/west-logo.png"
              alt="West Roleplay Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white mb-2">West Roleplay</h1>
          </div>
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300">Đang kiểm tra xác thực Steam...</p>
          <p className="text-gray-400 text-sm mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
}

export default ProtectedRoute;
