# 🚀 Railway Quick Setup - West Roleplay Whitelist

## 🎯 **URGENT: Railway Environment Variables Setup**

**Production Domain: https://whitelistweb.up.railway.app**

### ⚡ **Step 1: Access Railway Dashboard**
1. Go to: https://railway.app/dashboard
2. Find project: **Whitelist-Web**
3. Click on the service
4. Go to **Variables** tab

### ⚡ **Step 2: Copy & Paste These Variables**

**CRITICAL: Copy ALL these variables exactly:**

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://whitelistweb:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0
DISCORD_BOT_TOKEN=MTM4MTM4MzY0Njc5MTA3Mzg5Mg.GzTv77.7GGfJ9YFcWnQA-hUGBuyYByxpslhDGNqJQcMIg
DISCORD_WEBHOOK_CHANNEL_ID=1379909131028271174
DISCORD_MODERATOR_ROLE_ID=1381400664399413299
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1381393433914118214/3o07C9O1e_rBup3lnlqsiKT5UAel_hhrHDrk6vda66D763TnWti8wV_qdHOWGgB6B_LY
DISCORD_APPLICATION_ID=1381383646791073892
DISCORD_GUILD_ID=1379896680123601018
DISCORD_PUBLIC_KEY=3cd52b2363a175216af63397beaf8a630f252ab048733414f5d2ffc52fabe6e6
DISCORD_CLIENT_ID=1381383646791073892
DISCORD_CLIENT_SECRET=S6inGJZL4-MaItsjxb_qkjUjv1E0VPCq
DISCORD_REDIRECT_URI=https://whitelistweb.up.railway.app/auth/discord/callback
FRONTEND_URL=https://whitelistweb.up.railway.app
REACT_APP_DISCORD_CLIENT_ID=1381383646791073892
DEMO_MODE=false
JWT_SECRET=WestRoleplay2025_ProductionSecret_MongoDB_Discord_Integration_Secure
```

### ⚡ **Step 3: Deploy**
1. Click **Deploy** button in Railway
2. Wait 2-3 minutes for deployment
3. Test: https://whitelistweb.up.railway.app/api/health

### ⚡ **Step 4: Update Discord OAuth**
1. Go to: https://discord.com/developers/applications
2. Select your Discord app
3. Go to **OAuth2** > **General**
4. Add redirect URI: `https://whitelistweb.up.railway.app/auth/discord/callback`
5. **Save Changes**

### ✅ **Expected Result**

After setup, this URL should show:
**https://whitelistweb.up.railway.app/api/health**

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

### 🧪 **Test Application**

1. **Visit**: https://whitelistweb.up.railway.app
2. **Fill form** with test data
3. **Submit application**
4. **Check status** page

### 🔧 **If Still Not Working**

**Check Railway Logs:**
1. Railway Dashboard > Your Service
2. Click **Deployments** tab
3. Click latest deployment
4. View **Logs** for errors

**Common Issues:**
- `MongoDB connection error` → Check MONGODB_URI variable
- `Discord bot error` → Check DISCORD_BOT_TOKEN variable
- `CORS error` → Check FRONTEND_URL variable

### 📞 **Support**

If issues persist:
1. **Railway Logs**: Check for specific error messages
2. **MongoDB Atlas**: Ensure network access allows 0.0.0.0/0
3. **Discord Developer Portal**: Verify OAuth redirect URI

### 🎯 **Production URLs**

- **Main Application**: https://whitelistweb.up.railway.app
- **Health Check**: https://whitelistweb.up.railway.app/api/health
- **API Base**: https://whitelistweb.up.railway.app/api

### 📊 **Monitoring**

Monitor these endpoints:
- Health: https://whitelistweb.up.railway.app/api/health
- Application submission: Working when database connected
- Discord integration: Working when bot connected

---

**🚨 IMPORTANT: After setting up Railway variables, the application should work immediately!**
