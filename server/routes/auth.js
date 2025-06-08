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
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

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
    });

    const { access_token } = tokenResponse.data;

    // Get user information from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;

    // Find or create user in database
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      user = new User({
        discordId: discordUser.id,
        discordUsername: `${discordUser.username}#${discordUser.discriminator}`,
        discordAvatar: discordUser.avatar,
        email: discordUser.email,
        createdAt: new Date(),
      });
    } else {
      // Update existing user information
      user.discordUsername = `${discordUser.username}#${discordUser.discriminator}`;
      user.discordAvatar = discordUser.avatar;
      user.email = discordUser.email;
      user.lastLoginAt = new Date();
    }

    await user.save();

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
      message: 'Discord connected successfully',
      user: userData,
    });

  } catch (error) {
    console.error('Discord OAuth error:', error);
    
    if (error.response) {
      // Discord API error
      console.error('Discord API error:', error.response.data);
      return res.status(400).json({
        error: 'Failed to authenticate with Discord',
        details: error.response.data.error_description || 'Unknown Discord error',
      });
    }

    res.status(500).json({
      error: 'Internal server error during Discord authentication',
    });
  }
});

// POST /api/auth/discord/disconnect - Disconnect Discord account
router.post('/discord/disconnect', async (req, res) => {
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
router.get('/discord/config', (req, res) => {
  try {
    res.json({
      clientId: DISCORD_CLIENT_ID,
      redirectUri: DISCORD_REDIRECT_URI,
      scope: 'identify email',
    });
  } catch (error) {
    console.error('Discord config error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

module.exports = router;
