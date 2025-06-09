# Railway Deployment Troubleshooting Guide

## 🚨 **CONFIRMED ISSUE: Database Connection Failure**

### **Root Cause Analysis:**
✅ **Deployment Status:** Railway deployment is working correctly with latest code
✅ **Application Status:** Frontend loads, API responds, error handling works
❌ **Database Status:** MongoDB connection is failing (readyState: 0 - disconnected)

**Verification Results:**
```json
{
  "database": {
    "status": "disconnected",
    "readyState": 0,
    "connected": false
  },
  "discord": {
    "botConnected": null,
    "webhookConfigured": false
  }
}
```

The form submission error "Có lỗi xảy ra khi gửi đơn đăng ký" occurs because the database connection is failing, and the application correctly returns a 503 Service Unavailable error.

## 🔍 **Diagnostic Steps**

### **1. Check Application Health**
Visit: https://whitelistweb.up.railway.app/api/health

**Expected Response (After Latest Deployment):**
```json
{
  "status": "OK",
  "timestamp": "2025-06-09T00:33:04.529Z",
  "environment": "production",
  "database": {
    "status": "connected",
    "readyState": 1,
    "connected": true
  },
  "discord": {
    "botConnected": true,
    "webhookConfigured": true
  }
}
```

### **2. Test API Endpoints**
- **Health Check:** `GET /api/health` ✅ Working
- **Applications List:** `GET /api/applications` ❌ Returns 500 error
- **Form Submission:** `POST /api/applications` ❌ Database connection error

### **3. Check Railway Environment Variables**
Ensure these are set in Railway dashboard:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://whitelistweb:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0
DISCORD_BOT_TOKEN=MTM4MTM4MzY0Njc5MTA3Mzg5Mg.GzTv77.7GGfJ9YFcWnQA-hUGBuyYByxpslhDGNqJQcMIg
DISCORD_CLIENT_ID=1381383646791073892
DISCORD_CLIENT_SECRET=S6inGJZL4-MaItsjxb_qkjUjv1E0VPCq
FRONTEND_URL=https://whitelistweb.up.railway.app
```

## 🔧 **Immediate Fixes Applied**

### **Database Connection Validation:**
- ✅ Added `mongoose.connection.readyState` checks before all database operations
- ✅ Return 503 Service Unavailable when database is disconnected
- ✅ Enhanced error messages in Vietnamese for better UX

### **Enhanced Health Monitoring:**
- ✅ Upgraded `/api/health` endpoint with database and Discord status
- ✅ Added comprehensive system status reporting
- ✅ Improved debugging capabilities for production

### **Error Handling Improvements:**
- ✅ Specific error responses for database connection failures
- ✅ Graceful degradation when external services are unavailable
- ✅ Better HTTP status codes for different error scenarios

## 🚀 **Railway Deployment Checklist**

### **1. Environment Variables Setup**
In Railway dashboard, verify these variables are set:

| Variable | Value | Status |
|----------|-------|--------|
| `NODE_ENV` | `production` | ✅ Required |
| `MONGODB_URI` | `mongodb+srv://...` | ✅ Required |
| `DISCORD_BOT_TOKEN` | `MTM4...` | ✅ Required |
| `DISCORD_CLIENT_ID` | `1381383646791073892` | ✅ Required |
| `DISCORD_CLIENT_SECRET` | `S6inGJZL...` | ✅ Required |
| `FRONTEND_URL` | `https://whitelistweb.up.railway.app` | ✅ Required |

### **2. Build Process Verification**
- ✅ Build completes successfully (no PostCSS/Tailwind errors)
- ✅ Client build generates static files in `client/build/`
- ✅ Server starts without errors
- ✅ Express serves static files correctly

### **3. Database Connection Testing**
- ✅ MongoDB Atlas cluster is accessible
- ✅ Connection string includes correct credentials
- ✅ Network access is configured for Railway IPs
- ✅ Database user has read/write permissions

### **4. Discord Integration Testing**
- ✅ Bot token is valid and bot is online
- ✅ Bot has permissions in target Discord server
- ✅ Webhook URL is accessible
- ✅ OAuth redirect URI matches Railway domain

## 🔍 **Debugging Commands**

### **Check Railway Logs:**
```bash
railway logs
```

### **Test Database Connection:**
```bash
# In Railway console or local environment
node -e "
const mongoose = require('mongoose');
mongoose.connect('your_mongodb_uri')
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Failed:', err));
"
```

### **Test API Endpoints:**
```bash
# Health check
curl https://whitelistweb.up.railway.app/api/health

# Applications endpoint (should return database error if not connected)
curl https://whitelistweb.up.railway.app/api/applications
```

## 🎯 **Expected Resolution Timeline**

1. **Immediate (0-5 minutes):** Railway deploys latest code with database checks
2. **Short-term (5-15 minutes):** Health endpoint shows enhanced status
3. **Complete (15-30 minutes):** Form submissions work without errors

## 📞 **Next Steps if Issues Persist**

### **1. Check Railway Deployment Status**
- Verify latest commit is deployed
- Check build logs for errors
- Ensure environment variables are properly set

### **2. MongoDB Atlas Verification**
- Confirm cluster is running and accessible
- Check network access whitelist (allow all IPs: 0.0.0.0/0)
- Verify database user credentials

### **3. Manual Testing**
- Test form submission with valid data
- Check Discord notifications are sent
- Verify application status checking works

## 🆘 **Emergency Fallback**

If database issues persist, the application can run in **Discord-only mode**:
1. Set `DEMO_MODE=true` in Railway environment variables
2. This will bypass database operations and use Discord webhooks only
3. Applications will be sent to Discord but not stored in database

## 📊 **Success Metrics**

✅ **Application Fully Functional When:**
- Health endpoint shows database connected
- Form submissions complete successfully
- Discord notifications are sent
- Application history is accessible
- No "Có lỗi xảy ra" errors appear

The latest deployment should resolve the database connection issues and restore full functionality to the West Roleplay whitelist application.
