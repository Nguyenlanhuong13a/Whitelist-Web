import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [authToken, setAuthToken] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('westRoleplayUser');
        const token = localStorage.getItem('westRoleplayAuthToken');

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setAuthToken(token);
          // Check if user has Steam authentication (primary) or Discord (legacy)
          setConnectionStatus(parsedUser?.steamId ? 'connected' : 'disconnected');
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('westRoleplayUser');
        localStorage.removeItem('westRoleplayAuthToken');
        setConnectionStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save user data to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('westRoleplayUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('westRoleplayUser');
      localStorage.removeItem('westRoleplayAuthToken');
    }
  }, [user]);

  // Save auth token to localStorage whenever it changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('westRoleplayAuthToken', authToken);
    } else {
      localStorage.removeItem('westRoleplayAuthToken');
    }
  }, [authToken]);

  // Steam authentication functions
  const setSteamUser = (userData) => {
    try {
      // Extract auth token if present
      const { authToken, ...userDataWithoutToken } = userData;

      setUser(userDataWithoutToken);
      if (authToken) {
        setAuthToken(authToken);
      }
      setConnectionStatus('connected');
      console.log('Steam user set successfully:', userDataWithoutToken.steamId);
    } catch (error) {
      console.error('Error setting Steam user:', error);
    }
  };

  const checkSteamAuth = () => {
    return !!user?.steamId;
  };

  const requireSteamAuth = () => {
    if (!checkSteamAuth()) {
      // Redirect to Steam login
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
    return true;
  };

  const connectDiscord = async (code) => {
    try {
      setLoading(true);
      setConnectionStatus('connecting');
      console.log('Starting Discord connection with code:', code ? 'present' : 'missing');

      const response = await fetch('/api/auth/discord/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      console.log('Discord callback response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Discord callback error response:', errorData);

        // Provide more specific error messages
        let errorMessage = 'Failed to connect Discord';
        if (errorData.details) {
          errorMessage = `Discord connection failed: ${errorData.details}`;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log('Discord connection successful, user data received:', {
        discordId: userData.user?.discordId,
        username: userData.user?.discordUsername
      });

      // Immediately update user state and force localStorage sync
      const newUser = userData.user;
      setUser(newUser);
      setConnectionStatus('connected');

      // Force immediate localStorage update to prevent race conditions
      if (newUser) {
        localStorage.setItem('westRoleplayUser', JSON.stringify(newUser));
        console.log('User data immediately saved to localStorage');
      }

      // Add a small delay to ensure state has propagated
      await new Promise(resolve => setTimeout(resolve, 100));

      return userData;
    } catch (error) {
      console.error('Discord connection error:', error);
      setConnectionStatus('disconnected');

      // Enhance error message for network issues
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectDiscord = async () => {
    try {
      setLoading(true);

      if (!user?.steamId) {
        console.error('Cannot disconnect Discord: Steam authentication required');
        return;
      }

      // Update user to remove Discord data but keep Steam data
      const updatedUser = {
        ...user,
        discordId: null,
        discordUsername: null,
        discordAvatar: null,
        email: null,
      };

      setUser(updatedUser);

      // Optional: Call backend to invalidate any server-side sessions
      try {
        await fetch('/api/auth/discord/disconnect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Non-critical error, user data is already updated locally
        console.warn('Failed to notify server of Discord disconnect:', error);
      }

    } catch (error) {
      console.error('Discord disconnect error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setConnectionStatus('disconnected');

      // Clear all user data
      setUser(null);
      setAuthToken(null);

      // Optional: Call backend to invalidate any server-side sessions
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : '',
          },
        });
      } catch (error) {
        // Non-critical error, user data is already cleared locally
        console.warn('Failed to notify server of logout:', error);
      }

      // Redirect to login page
      window.location.href = '/login';

    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      setLoading(true);

      if (!user?.steamId) {
        console.warn('Cannot refresh user data: No Steam ID found');
        return;
      }

      const response = await fetch(`/api/auth/user/${user.steamId}`, {
        headers: {
          'Authorization': authToken ? `Bearer ${authToken}` : '',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else if (response.status === 401) {
        // Token expired or invalid, logout user
        console.warn('Authentication expired, logging out');
        logout();
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authToken,
    // Steam authentication
    setSteamUser,
    checkSteamAuth,
    requireSteamAuth,
    logout,
    // Discord authentication (secondary)
    connectDiscord,
    disconnectDiscord,
    refreshUserData,
    // Legacy compatibility
    isConnected: !!user?.steamId,
    connectionStatus,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
