# Railway Deployment Guide

## 🚀 West Roleplay Whitelist - Railway Production Deployment

### **Production URL:** https://whitelistweb.up.railway.app

## 📋 **Environment Variables for Railway**

Set these environment variables in your Railway project dashboard:

### **Required Environment Variables:**

**CRITICAL: Set these EXACT values in Railway dashboard:**

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
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

# Discord OAuth Configuration (Production)
DISCORD_CLIENT_ID=1381383646791073892
DISCORD_CLIENT_SECRET=S6inGJZL4-MaItsjxb_qkjUjv1E0VPCq
DISCORD_REDIRECT_URI=https://whitelistweb.up.railway.app/auth/discord/callback

# Frontend Configuration
FRONTEND_URL=https://whitelistweb.up.railway.app
REACT_APP_DISCORD_CLIENT_ID=1381383646791073892

# Optional Configuration
DEMO_MODE=false
JWT_SECRET=your_jwt_secret_here_change_in_production
```

## 🔧 **Discord OAuth Configuration**

### **Discord Developer Portal Setup:**

1. Go to: https://discord.com/developers/applications
2. Select your Discord Application
3. Navigate to **OAuth2** tab
4. In **Redirects** section, add:
   ```
   https://whitelistweb.up.railway.app/auth/discord/callback
   ```
5. Save changes

### **OAuth2 URLs:**
- **Development:** `http://localhost:3000/auth/discord/callback`
- **Production:** `https://whitelistweb.up.railway.app/auth/discord/callback`

## 📦 **Deployment Steps**

### **1. Connect Repository to Railway:**
- Link your GitHub repository to Railway
- Railway will automatically detect the Node.js project

### **2. Set Environment Variables:**
- Go to Railway project dashboard
- Navigate to **Variables** tab
- Add all required environment variables listed above

### **3. Configure Build Settings:**
- Railway uses the `railway.json` configuration
- Build command: `npm install`
- Start command: `npm start`

### **4. Deploy:**
- Push changes to your repository
- Railway will automatically deploy
- Monitor deployment logs for any issues

## 🔍 **Testing Production Deployment**

### **1. Basic Functionality:**
- Visit: https://whitelistweb.up.railway.app
- Test navigation between pages
- Verify responsive design

### **2. Discord OAuth Integration:**
- Go to Settings page: https://whitelistweb.up.railway.app/settings
- Click "Kết nối Discord"
- Complete OAuth flow
- Verify Discord ID auto-population

### **3. Application Submission:**
- Test whitelist application form
- Verify Discord webhook notifications
- Test moderator approval/rejection buttons

## 🛠 **Troubleshooting**

### **Common Issues:**

#### **1. OAuth Redirect Mismatch:**
- Ensure Discord redirect URI matches exactly: `https://whitelistweb.up.railway.app/auth/discord/callback`
- Check environment variable: `DISCORD_REDIRECT_URI`

#### **2. Database Connection:**
- Verify `MONGODB_URI` is correctly set
- Ensure MongoDB Atlas allows Railway IP addresses

#### **3. Discord Bot Issues:**
- Check `DISCORD_BOT_TOKEN` is valid
- Verify bot has proper permissions in Discord server
- Ensure `DISCORD_WEBHOOK_CHANNEL_ID` is correct

#### **4. Environment Variables:**
- All variables must be set in Railway dashboard
- Restart deployment after changing variables
- Check deployment logs for missing variables

## 📊 **Monitoring**

### **Railway Dashboard:**
- Monitor deployment status
- Check application logs
- View resource usage

### **Application Health:**
- Test all major features regularly
- Monitor Discord webhook delivery
- Check database connectivity

## 🔒 **Security Notes**

- Never commit `.env` files to repository
- Use Railway's secure environment variable storage
- Regularly rotate Discord bot tokens and OAuth secrets
- Monitor application logs for security issues

## 📱 **Features Available in Production**

✅ **Discord OAuth Integration** - User account connection  
✅ **Auto-Population** - Discord ID in all forms  
✅ **Whitelist Application** - Complete submission flow  
✅ **Application History** - User application tracking  
✅ **Status Checker** - Application status lookup  
✅ **Discord Notifications** - Real-time webhook alerts  
✅ **Moderator Controls** - Approval/rejection buttons  
✅ **Responsive Design** - Mobile and desktop support  
✅ **Vietnamese Language** - Complete localization  

## 🎯 **Production URL**

**Main Application:** https://whitelistweb.up.railway.app

**Key Pages:**
- Home: https://whitelistweb.up.railway.app/
- Settings: https://whitelistweb.up.railway.app/settings
- Status: https://whitelistweb.up.railway.app/status
- History: https://whitelistweb.up.railway.app/history
- Rules: https://whitelistweb.up.railway.app/rules
- About: https://whitelistweb.up.railway.app/about
