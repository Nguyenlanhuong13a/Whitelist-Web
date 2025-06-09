const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated with Steam
const requireSteamAuth = async (req, res, next) => {
  try {
    // Check for session token in headers
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.headers['x-auth-token'] ||
                  req.query.token;

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        details: 'Steam authentication is required to access this resource',
        redirectTo: '/auth/steam'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by Steam ID
    const user = await User.findOne({ steamId: decoded.steamId });
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        details: 'Steam user not found in database',
        redirectTo: '/auth/steam'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        details: 'Authentication token is invalid',
        redirectTo: '/auth/steam'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        details: 'Authentication token has expired',
        redirectTo: '/auth/steam'
      });
    }

    return res.status(500).json({
      error: 'Authentication error',
      details: 'Internal server error during authentication'
    });
  }
};

// Middleware to check if user is authenticated (optional - for routes that work with or without auth)
const optionalSteamAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.headers['x-auth-token'] ||
                  req.query.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ steamId: decoded.steamId });
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors for optional auth
        console.log('Optional auth token error (ignored):', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    next(); // Continue without authentication
  }
};

// Generate JWT token for authenticated user
const generateAuthToken = (user) => {
  const payload = {
    steamId: user.steamId,
    steamUsername: user.steamUsername,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

// Validate Steam ID format
const isValidSteamId = (steamId) => {
  // Steam ID should be a 17-digit number
  return /^\d{17}$/.test(steamId);
};

module.exports = {
  requireSteamAuth,
  optionalSteamAuth,
  generateAuthToken,
  isValidSteamId,
};
