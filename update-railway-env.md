# 🚨 URGENT: Railway Environment Variables Update Required

## Current Issue
The Railway deployment shows database disconnected because environment variables are not properly configured.

**Current Status:**
```json
{
  "database": {"status": "disconnected", "connected": false},
  "discord": {"botConnected": null, "webhookConfigured": false}
}
```

## 🔧 **IMMEDIATE ACTION REQUIRED**

### **Step 1: Access Railway Dashboard**
1. Go to: https://railway.app/dashboard
2. Select your "Whitelist-Web" project
3. Click on the service/deployment
4. Navigate to "Variables" tab

### **Step 2: Set/Update These Environment Variables**

**CRITICAL: Copy and paste these EXACT values:**

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

### **Step 3: Verify Critical Variables**

**Double-check these specific variables:**

1. **MONGODB_URI** - Must use `whitelistweb` (not `whitelisted`)
2. **DISCORD_BOT_TOKEN** - Must be the full token starting with `MTM4...`
3. **FRONTEND_URL** - Must be `https://whitelistweb.up.railway.app`
4. **NODE_ENV** - Must be `production`

### **Step 4: Redeploy**

After updating variables:
1. Click "Deploy" or trigger a new deployment
2. Wait for deployment to complete (2-3 minutes)
3. Test the health endpoint: https://whitelistweb.up.railway.app/api/health

### **Expected Result After Fix:**

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

## 🔍 **Verification Steps**

### **1. Test Database Connection**
```bash
curl https://whitelistweb.up.railway.app/api/health
```

### **2. Test Application Submission**
```bash
curl -X POST https://whitelistweb.up.railway.app/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "discord": "TestUser#1234",
    "steam": "STEAM_0:1:123456789",
    "name": "Test Character",
    "birthDate": "1995-01-01",
    "backstory": "This is a test backstory with more than 100 characters to meet validation requirements. Testing production deployment.",
    "reason": "Testing production deployment functionality."
  }'
```

### **3. Test Status Check**
```bash
curl https://whitelistweb.up.railway.app/api/applications/status/TestUser%231234
```

## 🌐 **Domain Configuration**

### **Current Status:**
- ✅ Railway URL: https://whitelistweb.up.railway.app (Working)
- ❌ Custom Domain: https://westroleplay.net (Not configured)

### **To Configure Custom Domain:**
1. In Railway dashboard, go to "Settings" > "Domains"
2. Add custom domain: `westroleplay.net`
3. Configure DNS records as instructed by Railway
4. Wait for SSL certificate provisioning

## 📊 **Monitoring**

After fixing environment variables, monitor:
1. **Health Endpoint**: https://whitelistweb.up.railway.app/api/health
2. **Application Logs**: Railway dashboard > Deployments > Logs
3. **Database Status**: Should show "connected": true
4. **Discord Integration**: Should show "botConnected": true

## 🚨 **If Issues Persist**

1. **Check Railway Logs**:
   - Go to Railway dashboard
   - Click on deployment
   - View "Logs" tab for error messages

2. **Common Error Messages**:
   - `MongoDB connection error: bad auth` → Check MONGODB_URI
   - `DISCORD_BOT_TOKEN environment variable is required` → Check Discord token
   - `CORS error` → Check FRONTEND_URL

3. **Contact Support**:
   - Railway Support: https://railway.app/help
   - MongoDB Atlas Support: https://support.mongodb.com/

## ✅ **Success Indicators**

When properly configured, you should see:
- ✅ Database: Connected
- ✅ Discord Bot: Online
- ✅ Application Submission: Working
- ✅ Status Check: Working
- ✅ History Lookup: Working
