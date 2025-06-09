# 🌐 Domain Migration Guide: westroleplay.net

## 📋 **Migration Overview**

This guide covers the complete migration from Railway subdomain (`whitelistweb.up.railway.app`) to the custom domain (`westroleplay.net`) for the West Roleplay whitelist application.

## 🔧 **Step 1: DNS Configuration**

### **Required DNS Records:**

```dns
# A Record (IPv4)
Type: A
Name: @
Value: [Railway IP Address]
TTL: 300

# CNAME Record (www subdomain)
Type: CNAME
Name: www
Value: westroleplay.net
TTL: 300

# Optional: CNAME for Railway backup
Type: CNAME
Name: backup
Value: whitelistweb.up.railway.app
TTL: 300
```

### **SSL Certificate:**
- Railway automatically provides SSL certificates for custom domains
- Ensure HTTPS is enforced for all traffic
- Verify SSL certificate covers both `westroleplay.net` and `www.westroleplay.net`

## 🔧 **Step 2: Railway Custom Domain Setup**

### **Add Custom Domain in Railway:**

1. **Login to Railway Dashboard**
2. **Navigate to your project** (Whitelist-Web)
3. **Go to Settings** → **Domains**
4. **Add Custom Domain:**
   - Primary: `westroleplay.net`
   - Alias: `www.westroleplay.net`
5. **Configure DNS** as shown above
6. **Wait for SSL provisioning** (5-15 minutes)

### **Verify Domain Configuration:**
```bash
# Test DNS resolution
nslookup westroleplay.net
nslookup www.westroleplay.net

# Test SSL certificate
curl -I https://westroleplay.net
curl -I https://www.westroleplay.net
```

## 🔧 **Step 3: Environment Variables Update**

### **Railway Dashboard Configuration:**

**CRITICAL: Update these environment variables in Railway:**

```env
# Frontend Configuration
FRONTEND_URL=https://westroleplay.net

# Discord OAuth Configuration
DISCORD_REDIRECT_URI=https://westroleplay.net/auth/discord/callback

# Keep Railway backup for transition
RAILWAY_BACKUP_URL=https://whitelistweb.up.railway.app
```

### **Local Development:**
- Update `.env` file with new production URLs
- Keep localhost settings for development
- Use `westroleplay.net.env` for production reference

## 🔧 **Step 4: Discord OAuth Configuration**

### **Discord Developer Portal Updates:**

1. **Go to:** https://discord.com/developers/applications
2. **Select your application:** West Roleplay Bot
3. **Navigate to OAuth2** → **General**
4. **Update Redirects:**
   ```
   https://westroleplay.net/auth/discord/callback
   https://www.westroleplay.net/auth/discord/callback
   https://whitelistweb.up.railway.app/auth/discord/callback (backup)
   ```
5. **Save Changes**

### **Test OAuth Flow:**
1. Visit: https://westroleplay.net/settings
2. Click "Kết nối Discord"
3. Complete OAuth authorization
4. Verify successful connection and redirect

## 🔧 **Step 5: Application Testing**

### **Comprehensive Testing Checklist:**

#### **✅ Basic Functionality:**
- [ ] Homepage loads correctly: https://westroleplay.net
- [ ] All navigation links work
- [ ] Responsive design functions properly
- [ ] Logo and branding display correctly

#### **✅ API Endpoints:**
- [ ] Health check: https://westroleplay.net/api/health
- [ ] Applications API: https://westroleplay.net/api/applications
- [ ] Status checker: https://westroleplay.net/api/applications/status/{id}

#### **✅ Discord Integration:**
- [ ] OAuth connection works
- [ ] Discord ID auto-population
- [ ] Webhook notifications sent
- [ ] Moderator approval buttons function

#### **✅ Database Operations:**
- [ ] Form submissions save to MongoDB
- [ ] Application history displays
- [ ] Status updates work correctly

#### **✅ Vietnamese Language:**
- [ ] All Vietnamese text displays correctly
- [ ] Form validation messages in Vietnamese
- [ ] Error messages in Vietnamese

## 🔧 **Step 6: Monitoring and Verification**

### **Automated Testing:**
```bash
# Run domain verification script
VERIFY_URL=https://westroleplay.net node verify-deployment.js

# Test backup URL
VERIFY_URL=https://whitelistweb.up.railway.app node verify-deployment.js
```

### **Manual Verification:**
1. **Complete Application Flow:**
   - Submit whitelist application
   - Check Discord notification
   - Verify database storage
   - Test moderator approval

2. **Cross-Browser Testing:**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Android Chrome)

3. **Performance Testing:**
   - Page load times
   - API response times
   - Image loading optimization

## 🚨 **Rollback Plan**

### **If Issues Occur:**

1. **Immediate Rollback:**
   ```env
   # Revert Railway environment variables
   FRONTEND_URL=https://whitelistweb.up.railway.app
   DISCORD_REDIRECT_URI=https://whitelistweb.up.railway.app/auth/discord/callback
   ```

2. **Discord OAuth Rollback:**
   - Remove new domain redirects
   - Keep only Railway URL active

3. **DNS Rollback:**
   - Remove A/CNAME records
   - Point domain elsewhere if needed

## 📊 **Migration Timeline**

### **Phase 1: Preparation (Day 1)**
- [ ] DNS configuration
- [ ] Railway domain setup
- [ ] SSL certificate provisioning

### **Phase 2: Configuration (Day 1-2)**
- [ ] Environment variables update
- [ ] Discord OAuth configuration
- [ ] Application testing

### **Phase 3: Go-Live (Day 2)**
- [ ] Final verification
- [ ] User communication
- [ ] Monitoring setup

### **Phase 4: Monitoring (Day 3-7)**
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] User feedback collection

## 🎯 **Success Criteria**

### **✅ Migration Complete When:**
- [ ] `westroleplay.net` loads correctly with SSL
- [ ] All application functionality works
- [ ] Discord OAuth flow functions properly
- [ ] Database operations are successful
- [ ] No errors in application logs
- [ ] Performance meets or exceeds previous levels

### **📈 **Post-Migration Benefits:**
- ✅ Professional custom domain
- ✅ Improved branding and trust
- ✅ Better SEO potential
- ✅ Easier to remember URL
- ✅ Maintained Railway infrastructure reliability

## 📞 **Support and Troubleshooting**

### **Common Issues:**

1. **DNS Propagation Delays:**
   - Wait 24-48 hours for global propagation
   - Use DNS checker tools
   - Clear local DNS cache

2. **SSL Certificate Issues:**
   - Verify domain ownership
   - Check Railway SSL status
   - Wait for automatic renewal

3. **OAuth Redirect Errors:**
   - Verify exact URL match in Discord
   - Check environment variables
   - Test with backup URL

### **Monitoring Tools:**
- Railway deployment logs
- Browser developer tools
- Discord webhook delivery logs
- MongoDB Atlas monitoring

**🎉 The migration to westroleplay.net will provide a professional, branded experience while maintaining all existing functionality!**
