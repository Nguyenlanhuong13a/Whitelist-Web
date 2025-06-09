/**
 * Discord Configuration Utility
 * Handles fetching Discord OAuth configuration with fallback mechanisms
 */

let cachedConfig = null;

/**
 * Get Discord OAuth configuration
 * First tries environment variable, then falls back to API
 * @returns {Promise<{clientId: string, redirectUri: string, scope: string}>}
 */
export const getDiscordConfig = async () => {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig;
  }

  // Try environment variable first
  const envClientId = process.env.REACT_APP_DISCORD_CLIENT_ID;

  if (envClientId && envClientId !== 'undefined') {
    console.log('Using Discord client ID from environment variables');
    cachedConfig = {
      clientId: envClientId,
      redirectUri: `${window.location.origin}/auth/discord/callback`,
      scope: 'identify email'
    };
    return cachedConfig;
  }

  // Fallback to API
  console.log('Environment variable not available, fetching Discord config from API...');
  
  try {
    const response = await fetch('/api/auth/discord/config');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const config = await response.json();
    
    if (!config.clientId) {
      throw new Error('API response does not contain clientId');
    }
    
    console.log('Successfully fetched Discord config from API');
    cachedConfig = {
      clientId: config.clientId,
      redirectUri: config.redirectUri || `${window.location.origin}/auth/discord/callback`,
      scope: config.scope || 'identify'
    };
    
    return cachedConfig;
  } catch (error) {
    console.error('Failed to fetch Discord configuration:', error);
    throw new Error('Không thể lấy cấu hình Discord. Vui lòng thử lại sau.');
  }
};

/**
 * Clear cached Discord configuration
 * Useful for testing or when configuration changes
 */
export const clearDiscordConfigCache = () => {
  cachedConfig = null;
};

/**
 * Generate Discord OAuth URL
 * @param {string} clientId - Discord application client ID
 * @param {string} redirectUri - OAuth redirect URI
 * @param {string} scope - OAuth scope
 * @returns {string} Complete Discord OAuth URL
 */
export const generateDiscordOAuthUrl = (clientId, redirectUri, scope = 'identify email') => {
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const encodedScope = encodeURIComponent(scope);

  // Add state parameter for CSRF protection and better error tracking
  const state = btoa(JSON.stringify({
    timestamp: Date.now(),
    origin: window.location.origin
  }));

  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${encodedScope}&state=${encodeURIComponent(state)}`;
};
