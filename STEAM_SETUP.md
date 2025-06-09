# Steam Authentication Setup Guide

This guide explains how to set up Steam OpenID authentication for the West Roleplay whitelist application.

## Overview

The application now requires Steam authentication as a prerequisite for accessing any pages. Users must log in with their Steam account before they can access the whitelist system.

## Steam Web API Key Setup

### Step 1: Get a Steam Web API Key

1. **Visit the Steam Web API Key page**: https://steamcommunity.com/dev/apikey
2. **Log in with your Steam account** (you need a Steam account with games to access this)
3. **Fill out the form**:
   - **Domain Name**: Enter your domain (e.g., `whitelistweb.up.railway.app` for production or `localhost` for development)
   - **Agree to the terms** and click "Register"
4. **Copy your API key** - it will be a 32-character hexadecimal string

### Step 2: Add the API Key to Environment Variables

#### For Development (.env)
```bash
STEAM_API_KEY=your_steam_api_key_here
```

#### For Railway Production
1. Go to your Railway project dashboard
2. Navigate to Variables tab
3. Add a new variable:
   - **Name**: `STEAM_API_KEY`
   - **Value**: Your Steam Web API key

#### For Other Hosting Platforms
Add the `STEAM_API_KEY` environment variable with your Steam Web API key value.

## Authentication Flow

### 1. User Access Control
- All pages now require Steam authentication
- Unauthenticated users are redirected to `/login`
- The login page initiates Steam OpenID authentication

### 2. Steam Login Process
1. User clicks "Login with Steam" on `/login`
2. User is redirected to Steam's authentication page
3. User logs in with Steam credentials
4. Steam redirects back to `/auth/steam/callback`
5. Backend processes the authentication and creates/updates user record
6. User is redirected to their intended destination

### 3. User Data Storage
- **Primary Authentication**: Steam ID (required)
- **Secondary Authentication**: Discord (optional, for linking)
- **User Data**: Steam username, avatar, profile URL
- **Session Management**: JWT tokens for API authentication

## Database Schema Changes

The User model has been updated to prioritize Steam authentication:

```javascript
{
  // Steam Authentication (Primary)
  steamId: String (required, unique),
  steamUsername: String (required),
  steamAvatar: String,
  steamProfileUrl: String,
  
  // Discord Authentication (Secondary/Optional)
  discordId: String (optional, unique),
  discordUsername: String,
  discordAvatar: String,
  email: String,
  
  // Timestamps and preferences...
}
```

## API Endpoints

### Steam Authentication
- `GET /api/auth/steam` - Initiate Steam authentication
- `GET /api/auth/steam/callback` - Handle Steam callback
- `GET /api/auth/steam/config` - Get Steam configuration

### User Management
- `GET /api/auth/user/:steamId` - Get user by Steam ID
- `GET /api/auth/user/discord/:discordId` - Get user by Discord ID (legacy)

## Frontend Components

### New Components
- `SteamLoginPage` - Steam login interface
- `SteamCallbackPage` - Handles Steam authentication callback
- `ProtectedRoute` - Wrapper for routes requiring authentication

### Updated Components
- `UserContext` - Now handles Steam authentication state
- `RegistrationForm` - Auto-populates Steam ID
- `App.js` - Protected routes and user info display

## Security Considerations

1. **Steam Web API Key**: Keep this secret and never expose it in frontend code
2. **Session Management**: JWT tokens are used for API authentication
3. **HTTPS Required**: Steam OpenID requires HTTPS in production
4. **Domain Validation**: Steam validates the return URL domain

## Migration from Discord-Only Authentication

Existing Discord-only users will need to:
1. Authenticate with Steam first
2. Link their Discord account in settings (optional)
3. Their existing application data will be preserved

## Troubleshooting

### Common Issues

1. **"Steam configuration is not properly set up"**
   - Ensure `STEAM_API_KEY` environment variable is set
   - Verify the API key is valid (32-character hex string)

2. **"Invalid return URL"**
   - Check that the domain in Steam API key registration matches your deployment domain
   - Ensure HTTPS is used in production

3. **"Authentication failed"**
   - Check Steam API key validity
   - Verify network connectivity to Steam servers
   - Check browser console for JavaScript errors

### Development Setup

For local development:
```bash
# .env file
STEAM_API_KEY=your_steam_api_key_here
FRONTEND_URL=http://localhost:3000
```

Note: You may need to register `localhost` as a domain for your Steam API key during development.

## Production Deployment

1. **Set Environment Variables**:
   ```
   STEAM_API_KEY=your_production_steam_api_key
   FRONTEND_URL=https://whitelistweb.up.railway.app
   ```

2. **Update CORS Configuration**: Ensure your production domain is included in CORS settings

3. **Database Migration**: Existing users will need to authenticate with Steam

## Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Steam Web API key is valid and domain is registered
4. Check that HTTPS is properly configured in production
