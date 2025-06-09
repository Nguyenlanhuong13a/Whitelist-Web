const express = require('express');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

// Discord OAuth configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/auth/discord/callback';

// POST /api/auth/discord/callback - Handle Discord OAuth callback
router.post('/discord/callback', async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Authorization code is required',
        details: 'No authorization code provided in request'
      });
    }

    // Validate code format (Discord codes are typically 30 characters)
    if (typeof code !== 'string' || code.length < 20 || code.length > 50) {
      return res.status(400).json({
        error: 'Invalid authorization code format',
        details: 'Authorization code appears to be malformed'
      });
    }

    console.log('Processing Discord OAuth callback with code length:', code.length);

    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', {
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000, // 10 second timeout
    });

    const { access_token } = tokenResponse.data;

    // Get user information from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;

    console.log('Discord user data received:', {
      id: discordUser.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      global_name: discordUser.global_name,
      email: discordUser.email
    });

    // Handle modern Discord username format
    let displayUsername;
    if (discordUser.global_name) {
      // New username system: use global_name if available
      displayUsername = discordUser.global_name;
    } else if (discordUser.discriminator && discordUser.discriminator !== '0') {
      // Legacy username system: username#discriminator
      displayUsername = `${discordUser.username}#${discordUser.discriminator}`;
    } else {
      // Modern username system without discriminator
      displayUsername = discordUser.username;
    }

    // Find or create user in database
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      console.log('Creating new user for Discord ID:', discordUser.id);
      user = new User({
        discordId: discordUser.id,
        discordUsername: displayUsername,
        discordAvatar: discordUser.avatar,
        email: discordUser.email,
        createdAt: new Date(),
      });
    } else {
      console.log('Updating existing user for Discord ID:', discordUser.id);
      // Update existing user information
      user.discordUsername = displayUsername;
      user.discordAvatar = discordUser.avatar;
      user.email = discordUser.email;
      user.lastLoginAt = new Date();
    }

    await user.save();
    console.log('User saved successfully:', user.discordId);

    // Return user data (without sensitive information)
    const userData = {
      discordId: user.discordId,
      discordUsername: user.discordUsername,
      discordAvatar: user.discordAvatar,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      preferences: user.preferences,
    };

    console.log('Sending successful response with user data:', userData.discordId);
    res.json({
      success: true,
      message: 'Discord connected successfully',
      user: userData,
    });

  } catch (error) {
    console.error('Discord OAuth error:', error);

    if (error.response) {
      // Discord API error
      console.error('Discord API error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url
      });

      // Handle specific Discord OAuth errors
      const discordError = error.response.data.error;
      const discordErrorDescription = error.response.data.error_description;

      if (discordError === 'invalid_grant') {
        return res.status(400).json({
          error: 'Invalid "code" in request',
          details: 'Authorization code has expired or been used already. Please try connecting again.',
          statusCode: error.response.status
        });
      }

      if (discordError === 'invalid_request') {
        return res.status(400).json({
          error: 'Invalid OAuth request',
          details: discordErrorDescription || 'The OAuth request parameters are invalid',
          statusCode: error.response.status
        });
      }

      return res.status(400).json({
        error: 'Failed to authenticate with Discord',
        details: discordErrorDescription || discordError || 'Unknown Discord error',
        statusCode: error.response.status
      });
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('Network error during Discord OAuth:', error.message);
      return res.status(503).json({
        error: 'Unable to connect to Discord services',
        details: 'Please try again later'
      });
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Timeout error during Discord OAuth:', error.message);
      return res.status(408).json({
        error: 'Request timeout',
        details: 'Discord authentication timed out. Please try again.'
      });
    }

    console.error('Unexpected error during Discord OAuth:', error.message, error.stack);
    res.status(500).json({
      error: 'Internal server error during Discord authentication',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

// POST /api/auth/discord/disconnect - Disconnect Discord account
router.post('/discord/disconnect', async (_req, res) => {
  try {
    // In a more complex implementation, you might want to:
    // 1. Validate the user session
    // 2. Remove the user from the database
    // 3. Invalidate any stored tokens
    
    // For now, we'll just acknowledge the disconnect
    res.json({
      success: true,
      message: 'Discord disconnected successfully',
    });

  } catch (error) {
    console.error('Discord disconnect error:', error);
    res.status(500).json({
      error: 'Internal server error during Discord disconnect',
    });
  }
});

// GET /api/auth/user/:discordId - Get user information
router.get('/user/:discordId', async (req, res) => {
  try {
    const { discordId } = req.params;

    const user = await User.findOne({ discordId });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Return user data (without sensitive information)
    const userData = {
      discordId: user.discordId,
      discordUsername: user.discordUsername,
      discordAvatar: user.discordAvatar,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    res.json({
      success: true,
      user: userData,
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// GET /api/auth/discord/config - Get Discord OAuth configuration
router.get('/discord/config', (_req, res) => {
  try {
    // Validate that required Discord configuration is available
    if (!DISCORD_CLIENT_ID) {
      console.error('Discord config error: DISCORD_CLIENT_ID is not set');
      return res.status(500).json({
        error: 'Discord configuration is not properly set up',
        details: 'DISCORD_CLIENT_ID environment variable is missing'
      });
    }

    res.json({
      clientId: DISCORD_CLIENT_ID,
      redirectUri: DISCORD_REDIRECT_URI,
      scope: 'identify email',
      configured: true
    });
  } catch (error) {
    console.error('Discord config error:', error);
    res.status(500).json({
      error: 'Internal server error',
      configured: false
    });
  }
});

// GET /api/auth/debug - Debug endpoint for OAuth testing (development only)
router.get('/debug', (_req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    res.json({
      environment: process.env.NODE_ENV,
      discord: {
        clientId: DISCORD_CLIENT_ID ? 'configured' : 'missing',
        clientSecret: DISCORD_CLIENT_SECRET ? 'configured' : 'missing',
        redirectUri: DISCORD_REDIRECT_URI,
        webhookUrl: process.env.DISCORD_WEBHOOK_URL ? 'configured' : 'missing'
      },
      database: {
        uri: process.env.MONGODB_URI ? 'configured' : 'missing'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;
