import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('westRoleplayUser');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('westRoleplayUser');
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
    }
  }, [user]);

  const connectDiscord = async (code) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/discord/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect Discord');
      }

      const userData = await response.json();
      setUser(userData.user);
      
      return userData;
    } catch (error) {
      console.error('Discord connection error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectDiscord = async () => {
    try {
      setLoading(true);
      
      // Clear user data
      setUser(null);
      
      // Optional: Call backend to invalidate any server-side sessions
      try {
        await fetch('/api/auth/discord/disconnect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Non-critical error, user data is already cleared locally
        console.warn('Failed to notify server of disconnect:', error);
      }
      
    } catch (error) {
      console.error('Discord disconnect error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      setLoading(true);
      
      if (!user?.discordId) {
        return;
      }

      const response = await fetch(`/api/auth/user/${user.discordId}`);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
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
    connectDiscord,
    disconnectDiscord,
    refreshUserData,
    isConnected: !!user?.discordId,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
