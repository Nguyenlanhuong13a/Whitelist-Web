// Steam authentication utility functions

/**
 * Get Steam authentication configuration from backend
 */
export const getSteamConfig = async () => {
  try {
    const response = await fetch('/api/auth/steam/config');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.details || data.error || 'Failed to get Steam configuration');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting Steam config:', error);
    throw error;
  }
};

/**
 * Initiate Steam authentication
 */
export const initiateSteamAuth = async () => {
  try {
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

    return data.redirectUrl;
  } catch (error) {
    console.error('Error initiating Steam auth:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated with Steam
 */
export const isAuthenticated = () => {
  try {
    const userData = localStorage.getItem('westRoleplayUser');
    const authToken = localStorage.getItem('westRoleplayAuthToken');
    
    if (!userData || !authToken) {
      return false;
    }
    
    const user = JSON.parse(userData);
    return !!(user.steamId && authToken);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get current user data
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('westRoleplayUser');
    if (!userData) {
      return null;
    }
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  return localStorage.getItem('westRoleplayAuthToken');
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('westRoleplayUser');
  localStorage.removeItem('westRoleplayAuthToken');
};

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // If unauthorized, clear auth and redirect to login
  if (response.status === 401) {
    clearAuth();
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    throw new Error('Authentication expired');
  }
  
  return response;
};

/**
 * Validate Steam ID format
 */
export const isValidSteamId = (steamId) => {
  // Steam ID should be a 17-digit number
  return /^\d{17}$/.test(steamId);
};

/**
 * Format Steam profile URL
 */
export const formatSteamProfileUrl = (steamId) => {
  if (!isValidSteamId(steamId)) {
    return null;
  }
  return `https://steamcommunity.com/profiles/${steamId}`;
};

/**
 * Get Steam avatar URL with fallback
 */
export const getSteamAvatarUrl = (user, size = 'medium') => {
  if (!user) return null;
  
  // Try to get avatar from user data
  if (user.steamAvatar) {
    return user.steamAvatar;
  }
  
  // Fallback to default Steam avatar
  return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_${size}.jpg`;
};
