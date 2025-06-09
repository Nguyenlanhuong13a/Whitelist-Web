# 🔄 MongoDB Credentials Update Guide

## 📋 **Credentials Change Summary**

**Previous Credentials:**
- Username: `whitelisted`
- Password: `baudeveloper`

**New Credentials:**
- Username: `whitelistweb`
- Password: `baudeveloper` (unchanged)

**Updated Connection String:**
```
mongodb+srv://whitelistweb:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0
```

## ✅ **Files Updated**

### **Configuration Files:**
- ✅ `.env` - Updated primary MongoDB URI
- ✅ `railway.env` - Updated Railway environment template
- ✅ `westroleplay.net.env` - Updated production environment template
- ✅ `test-mongodb-connection.js` - Updated test script credentials

### **Documentation Files:**
- ✅ `RAILWAY_MONGODB_FIX.md` - Updated connection examples
- ✅ `RAILWAY_ENV_UPDATE_REQUIRED.md` - Updated required variables
- ✅ `fix-database-connection.md` - Updated troubleshooting guide

## 🔧 **Required Actions**

### **Step 1: Verify MongoDB Atlas User**

1. **Login to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Navigate to Database Access**
3. **Verify user `whitelistweb` exists:**
   - Username: `whitelistweb`
   - Password: `baudeveloper`
   - Database User Privileges: `Read and write to any database`

4. **If user doesn't exist, create it:**
   - Click **"Add New Database User"**
   - Authentication Method: **Password**
   - Username: `whitelistweb`
   - Password: `baudeveloper`
   - Database User Privileges: **Built-in Role** → `Read and write to any database`
   - Click **"Add User"**

### **Step 2: Update Railway Environment Variables**

**CRITICAL: Update Railway dashboard with new MongoDB URI:**

1. **Login to Railway:** https://railway.app/
2. **Navigate to Whitelist-Web project**
3. **Go to Variables tab**
4. **Update MONGODB_URI:**
   ```env
   MONGODB_URI=mongodb+srv://whitelistweb:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0
   ```
5. **Save changes and wait for redeploy** (3-5 minutes)

### **Step 3: Test Local Connection**

Run the updated connection test:
```bash
node test-mongodb-connection.js
```

**Expected Output:**
```
🔄 Testing MongoDB Atlas Connection...
👤 Username: whitelistweb
✅ MongoDB connection successful with new credentials!
📊 Connection state: 1
🏷️ Database name: whitelist-web
```

### **Step 4: Verify Railway Deployment**

After Railway redeploys, check:
```
https://whitelistweb.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "database": {
    "status": "connected",
    "readyState": 1,
    "connected": true
  }
}
```

### **Step 5: Test Application Functionality**

1. **Form Submission Test:**
   - Go to: https://whitelistweb.up.railway.app
   - Fill out whitelist form
   - Submit application
   - Should see success message

2. **Application History Test:**
   - Go to: https://whitelistweb.up.railway.app/history
   - Should load without database errors

3. **Status Checker Test:**
   - Go to: https://whitelistweb.up.railway.app/status
   - Test with valid Discord ID
   - Should return application status

## 🔍 **Verification Checklist**

### **✅ MongoDB Atlas:**
- [ ] User `whitelistweb` exists in Database Access
- [ ] User has `Read and write to any database` privileges
- [ ] Network Access allows `0.0.0.0/0` (all IPs)
- [ ] Cluster is active (not paused)

### **✅ Railway Environment:**
- [ ] `MONGODB_URI` updated with new credentials
- [ ] Railway deployment completed successfully
- [ ] No deployment errors in logs

### **✅ Application Testing:**
- [ ] Health endpoint shows database connected
- [ ] Form submissions work without errors
- [ ] Application history loads correctly
- [ ] Status checker functions properly
- [ ] Vietnamese error messages display correctly

## 🚨 **Troubleshooting**

### **If Connection Still Fails:**

1. **Check MongoDB Atlas:**
   - Verify cluster is not paused
   - Confirm user `whitelistweb` exists
   - Check network access settings

2. **Alternative Connection String:**
   ```env
   MONGODB_URI=mongodb+srv://whitelisted:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0
   ```

3. **Create New User:**
   - Username: `westroleplay`
   - Password: `westroleplay2024`
   - Update connection string accordingly

### **If Railway Deployment Issues:**
- Check Railway deployment logs
- Verify environment variables are saved
- Restart deployment manually if needed

## ⏱️ **Expected Timeline**

1. **MongoDB Atlas user verification:** 2-3 minutes
2. **Railway environment update:** 2-3 minutes
3. **Railway redeploy:** 3-5 minutes
4. **Database connection establishment:** 1-2 minutes
5. **Total resolution time:** 8-13 minutes

## 🎯 **Success Criteria**

**✅ Update successful when:**
- Health endpoint shows `"connected": true`
- Form submissions complete without errors
- Application history loads correctly
- No "Không thể kết nối đến cơ sở dữ liệu" messages
- All Vietnamese content displays properly
- Discord integrations function correctly

## 🚀 **Next Steps After Success**

Once database connection is working:

1. **Proceed with custom domain setup** (westroleplay.net)
2. **Configure DNS records** for new domain
3. **Update Discord Developer Portal** OAuth redirects
4. **Test both domains** during transition
5. **Monitor application performance**

## 📞 **Support Information**

**If issues persist:**
- MongoDB Atlas Support: https://support.mongodb.com/
- Railway Support: https://railway.app/help
- Check application logs for specific error messages
- Verify all environment variables are correctly set

**Current Status:** 🔄 **CREDENTIALS UPDATED - TESTING REQUIRED**
**Next Action:** 🧪 **VERIFY MONGODB ATLAS USER AND TEST CONNECTION**
