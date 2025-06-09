# 🚀 West Roleplay Production Setup Guide (Railway Domain)

## 📋 Critical Production Configuration Checklist

**Production Domain: https://whitelistweb.up.railway.app**

### ✅ **Step 1: Railway Environment Variables**

**CRITICAL: Set these EXACT values in Railway dashboard:**

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration - CORRECTED CREDENTIALS
MONGODB_URI=mongodb+srv://whitelistweb:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0

# Discord Bot Configuration
DISCORD_BOT_TOKEN=MTM4MTM4MzY0Njc5MTA3Mzg5Mg.GzTv77.7GGfJ9YFcWnQA-hUGBuyYByxpslhDGNqJQcMIg
DISCORD_WEBHOOK_CHANNEL_ID=1379909131028271174
DISCORD_MODERATOR_ROLE_ID=1381400664399413299
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1381393433914118214/3o07C9O1e_rBup3lnlqsiKT5UAel_hhrHDrk6vda66D763TnWti8wV_qdHOWGgB6B_LY

# Discord Application Configuration
DISCORD_APPLICATION_ID=1381383646791073892
DISCORD_GUILD_ID=1379896680123601018
DISCORD_PUBLIC_KEY=3cd52b2363a175216af63397beaf8a630f252ab048733414f5d2ffc52fabe6e6

# Discord OAuth Configuration - RAILWAY PRODUCTION DOMAIN
DISCORD_CLIENT_ID=1381383646791073892
DISCORD_CLIENT_SECRET=S6inGJZL4-MaItsjxb_qkjUjv1E0VPCq
DISCORD_REDIRECT_URI=https://whitelistweb.up.railway.app/auth/discord/callback

# Frontend Configuration - RAILWAY PRODUCTION DOMAIN
FRONTEND_URL=https://whitelistweb.up.railway.app
REACT_APP_DISCORD_CLIENT_ID=1381383646791073892

# Demo Mode
DEMO_MODE=false

# Security - PRODUCTION SECRET
JWT_SECRET=WestRoleplay2025_ProductionSecret_MongoDB_Discord_Integration_Secure
```

### ✅ **Step 2: MongoDB Atlas Network Access**

**CRITICAL: Configure MongoDB Atlas for production:**

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Navigate to Network Access**:
   - Go to your project
   - Click "Network Access" in left sidebar
3. **Add IP Addresses**:
   ```
   0.0.0.0/0 (Allow access from anywhere)
   ```
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere"
   - Comment: "Railway Production Access"
   - Click "Confirm"

4. **Verify Database User**:
   - Go to "Database Access"
   - Ensure user `whitelistweb` exists with password `baudeveloper`
   - Permissions: "Read and write to any database"

### ✅ **Step 3: Discord OAuth Configuration**

**Update Discord Developer Portal:**

1. **Go to**: https://discord.com/developers/applications
2. **Select your application**: West Roleplay Bot
3. **Navigate to OAuth2 > General**
4. **Add Redirect URIs**:
   ```
   https://whitelistweb.up.railway.app/auth/discord/callback
   ```
5. **Save Changes**

### ✅ **Step 4: Domain Configuration**

**Ensure proper domain setup:**

1. **Primary Domain**: `westroleplay.net`
2. **Railway Backup**: `whitelistweb.up.railway.app`
3. **SSL Certificate**: Auto-configured by Railway
4. **CORS Origins**: Configured in server.js

### ✅ **Step 5: Deployment Verification**

**Run verification script:**

```bash
node verify-production-connectivity.js
```

**Expected output:**
- ✅ MongoDB Atlas: Connected and functional
- ✅ Production URLs: Accessible
- ✅ API Endpoints: Responding

### 🔧 **Troubleshooting Common Issues**

#### **Issue 1: Database Connection Failed**
```
❌ MongoDB connection failed: bad auth : Authentication failed
```

**Solution:**
1. Verify `MONGODB_URI` in Railway uses `whitelistweb` (not `whitelisted`)
2. Check MongoDB Atlas Network Access allows 0.0.0.0/0
3. Ensure database user exists with correct permissions

#### **Issue 2: CORS Errors**
```
Access to fetch at 'https://westroleplay.net/api/...' from origin 'https://westroleplay.net' has been blocked by CORS policy
```

**Solution:**
1. Verify `FRONTEND_URL=https://westroleplay.net` in Railway
2. Check server.js CORS configuration includes production domain
3. Restart Railway deployment

#### **Issue 3: Discord OAuth Redirect Error**
```
Invalid redirect_uri
```

**Solution:**
1. Add production URLs to Discord Developer Portal
2. Verify `DISCORD_REDIRECT_URI` matches exactly
3. Check for trailing slashes or typos

### 📊 **Production Health Monitoring**

**Health Check Endpoint:**
- URL: `https://westroleplay.net/api/health`
- Expected Response:
```json
{
  "status": "OK",
  "environment": "production",
  "database": {
    "status": "connected",
    "connected": true
  },
  "discord": {
    "botConnected": true,
    "webhookConfigured": true
  }
}
```

### 🚀 **Deployment Commands**

**For Railway:**
```bash
# 1. Commit changes
git add .
git commit -m "Production configuration fixes"

# 2. Push to GitHub
git push origin master

# 3. Railway auto-deploys from GitHub
# Monitor deployment at: https://railway.app/dashboard
```

### 📞 **Support**

If issues persist:
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Test MongoDB connection with verification script
4. Ensure Discord OAuth settings are correct

**Production URLs:**
- Primary: https://westroleplay.net
- Backup: https://whitelistweb.up.railway.app
