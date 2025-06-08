# 🚀 Hướng Dẫn Deploy Whitelist Web Miễn Phí

## Phương án 1: Railway (Khuyến nghị)

### Bước 1: Chuẩn bị
1. Đăng ký tài khoản tại [railway.app](https://railway.app)
2. Kết nối với GitHub account của bạn

### Bước 2: Deploy Backend
1. Vào Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Chọn repository `Whitelist-Web`
4. Railway sẽ tự động detect và deploy

### Bước 3: Cấu hình Environment Variables
Trong Railway project settings, thêm các biến môi trường:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://whitelistweb:baudeveloper@cluster0.mooze8v.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_WEBHOOK_CHANNEL_ID=your_channel_id
DISCORD_MODERATOR_ROLE_ID=1381400664399413299
DISCORD_WEBHOOK_URL=your_webhook_url
DEMO_MODE=false
```

### Bước 4: Custom Domain (Tùy chọn)
- Railway cung cấp domain dạng: `your-app.railway.app`
- Có thể thêm custom domain nếu có

## Phương án 2: Render

### Bước 1: Chuẩn bị
1. Đăng ký tại [render.com](https://render.com)
2. Kết nối GitHub

### Bước 2: Deploy
1. New → Web Service
2. Chọn repository `Whitelist-Web`
3. Cấu hình:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Bước 3: Environment Variables
Thêm tất cả biến môi trường như Railway

## Phương án 3: Vercel + Railway

### Frontend (Vercel)
1. Đăng ký [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Chọn thư mục `client`
4. Deploy tự động

### Backend (Railway)
- Deploy backend như hướng dẫn Railway ở trên
- Update API URL trong frontend

## 🔧 Cấu hình cho Production

### 1. Tạo file package.json cho root
```json
{
  "name": "whitelist-web-production",
  "version": "1.0.0",
  "scripts": {
    "start": "node server/server.js",
    "build": "cd client && npm install && npm run build",
    "postbuild": "npm install --only=production"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 2. Cập nhật server.js cho production
- Serve static files từ client/build
- Cấu hình CORS cho production domain

## 🌐 Sau khi Deploy

### 1. Test Website
- Truy cập URL được cung cấp
- Test form đăng ký
- Kiểm tra Discord integration

### 2. Cập nhật Discord Bot
- Thêm production domain vào Discord app settings
- Test button interactions

### 3. Monitor
- Kiểm tra logs trên platform
- Monitor database connections
- Test performance

## 💡 Tips Tối Ưu

### 1. Database
- Sử dụng MongoDB Atlas (miễn phí 512MB)
- Backup định kỳ

### 2. Performance
- Enable gzip compression
- Optimize images
- Use CDN cho static assets

### 3. Security
- Không commit .env file
- Sử dụng environment variables
- Enable HTTPS

## 🆘 Troubleshooting

### Lỗi thường gặp:
1. **Build failed**: Kiểm tra package.json và dependencies
2. **Database connection**: Verify MongoDB URI
3. **Discord bot offline**: Check bot token và permissions
4. **CORS errors**: Cấu hình CORS cho production domain

### Support:
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
