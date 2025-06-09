# Hướng Dẫn Cài Đặt và Sử Dụng West Roleplay Whitelist

## 📋 Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
3. [Cài Đặt Cơ Bản](#cài-đặt-cơ-bản)
4. [Cấu Hình Database](#cấu-hình-database)
5. [Cấu Hình Discord](#cấu-hình-discord)
6. [Cấu Hình Steam](#cấu-hình-steam)
7. [Cấu Hình Environment Variables](#cấu-hình-environment-variables)
8. [Chạy Ứng Dụng](#chạy-ứng-dụng)
9. [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
10. [Deploy Production](#deploy-production)
11. [Xử Lý Lỗi Thường Gặp](#xử-lý-lỗi-thường-gặp)

---

## 🎯 Giới Thiệu

West Roleplay Whitelist là một ứng dụng web được thiết kế để quản lý danh sách trắng (whitelist) cho server roleplay. Ứng dụng tích hợp với Discord và Steam để xác thực người dùng và tự động hóa quy trình phê duyệt.

### Tính Năng Chính:
- ✅ Xác thực Discord OAuth2
- ✅ Xác thực Steam OpenID
- ✅ Gửi đơn đăng ký whitelist
- ✅ Theo dõi trạng thái đơn đăng ký
- ✅ Tích hợp Discord webhook cho thông báo
- ✅ Giao diện responsive với thiết kế glassmorphism
- ✅ Hỗ trợ tiếng Việt đầy đủ

---

## 💻 Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết:
- **Node.js**: Phiên bản 18.0.0 trở lên
- **npm**: Phiên bản 8.0.0 trở lên
- **Git**: Để clone repository
- **MongoDB**: Database (có thể sử dụng MongoDB Atlas miễn phí)

### Tài Khoản Cần Thiết:
- **Discord Developer Account**: Để tạo Discord application
- **Steam Developer Account**: Để lấy Steam API key
- **MongoDB Atlas Account**: Để sử dụng cloud database (tùy chọn)
- **Railway Account**: Để deploy production (tùy chọn)

---

## 🚀 Cài Đặt Cơ Bản

### Bước 1: Clone Repository
```bash
git clone https://github.com/Nguyenlanhuong13a/Whitelist-Web.git
cd Whitelist-Web
```

### Bước 2: Cài Đặt Dependencies
```bash
# Cài đặt dependencies cho backend
npm install

# Cài đặt dependencies cho frontend
cd client
npm install
cd ..

# Hoặc sử dụng script tự động
npm run install-all
```

### Bước 3: Tạo File Environment
```bash
# Copy file mẫu
cp .env.example .env
cp client/.env.example client/.env
```

---

## 🗄️ Cấu Hình Database

### Tùy Chọn 1: MongoDB Local
1. Cài đặt MongoDB trên máy tính
2. Khởi động MongoDB service
3. Sử dụng connection string: `mongodb://localhost:27017/whitelist-web`

### Tùy Chọn 2: MongoDB Atlas (Khuyến Nghị)
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Tạo tài khoản miễn phí
3. Tạo cluster mới:
   - Chọn **M0 Sandbox** (miễn phí)
   - Chọn region gần nhất (Singapore cho Việt Nam)
   - Đặt tên cluster: `Cluster0`

4. Tạo database user:
   - Vào **Database Access**
   - Click **Add New Database User**
   - Username: `whitelistweb`
   - Password: `[TẠO_MẬT_KHẨU_MẠNH]`
   - Role: **Read and write to any database**

5. Cấu hình Network Access:
   - Vào **Network Access**
   - Click **Add IP Address**
   - Chọn **Allow Access from Anywhere** (0.0.0.0/0)

6. Lấy Connection String:
   - Vào **Database** → **Connect**
   - Chọn **Connect your application**
   - Copy connection string
   - Thay thế `<password>` bằng mật khẩu đã tạo

**Ví dụ Connection String:**
```
mongodb+srv://whitelistweb:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🎮 Cấu Hình Discord

### Bước 1: Tạo Discord Application
1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Đặt tên: `West Roleplay Whitelist`
4. Click **Create**

### Bước 2: Cấu Hình OAuth2
1. Vào tab **OAuth2** → **General**
2. Copy **Client ID** và **Client Secret**
3. Thêm Redirect URLs:
   ```
   http://localhost:3000/auth/discord/callback
   https://YOUR_DOMAIN.com/auth/discord/callback
   ```

### Bước 3: Tạo Discord Bot
1. Vào tab **Bot**
2. Click **Add Bot**
3. Copy **Bot Token**
4. Bật các Privileged Gateway Intents:
   - **Presence Intent**
   - **Server Members Intent**
   - **Message Content Intent**

### Bước 4: Mời Bot Vào Server
1. Vào tab **OAuth2** → **URL Generator**
2. Chọn scopes: `bot`, `applications.commands`
3. Chọn bot permissions:
   - **Send Messages**
   - **Manage Messages**
   - **Embed Links**
   - **Read Message History**
4. Copy URL và mời bot vào Discord server

### Bước 5: Tạo Webhook
1. Vào Discord server → Channel settings
2. Vào tab **Integrations** → **Webhooks**
3. Click **Create Webhook**
4. Copy Webhook URL

### Bước 6: Lấy IDs
- **Guild ID**: Right-click server → Copy Server ID
- **Channel ID**: Right-click channel → Copy Channel ID
- **Role ID**: Server Settings → Roles → Right-click role → Copy Role ID

---

## 🎯 Cấu Hình Steam

### Bước 1: Lấy Steam API Key
1. Truy cập [Steam Web API](https://steamcommunity.com/dev/apikey)
2. Đăng nhập Steam account
3. Điền domain name: `localhost` (cho development)
4. Copy API Key

### Bước 2: Cấu Hình Steam OpenID
Steam OpenID sẽ tự động hoạt động với API key, không cần cấu hình thêm.

---

## ⚙️ Cấu Hình Environment Variables

### File `.env` (Root Directory)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb+srv://whitelistweb:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/whitelist-web?retryWrites=true&w=majority&appName=Cluster0

# Discord Bot Configuration
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
DISCORD_WEBHOOK_CHANNEL_ID=YOUR_CHANNEL_ID
DISCORD_MODERATOR_ROLE_ID=YOUR_MODERATOR_ROLE_ID
DISCORD_WEBHOOK_URL=YOUR_WEBHOOK_URL

# Discord Application Configuration
DISCORD_APPLICATION_ID=YOUR_APPLICATION_ID
DISCORD_GUILD_ID=YOUR_GUILD_ID
DISCORD_PUBLIC_KEY=YOUR_PUBLIC_KEY

# Steam Authentication Configuration
STEAM_API_KEY=YOUR_STEAM_API_KEY

# Discord OAuth Configuration
DISCORD_CLIENT_ID=YOUR_CLIENT_ID
DISCORD_CLIENT_SECRET=YOUR_CLIENT_SECRET
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
REACT_APP_DISCORD_CLIENT_ID=YOUR_CLIENT_ID

# Demo Mode
DEMO_MODE=false

# Security
JWT_SECRET=YOUR_STRONG_JWT_SECRET
```

### File `client/.env`
```env
# Discord OAuth Configuration
REACT_APP_DISCORD_CLIENT_ID=YOUR_CLIENT_ID
```

---

## 🏃‍♂️ Chạy Ứng Dụng

### Development Mode
```bash
# Chạy cả frontend và backend
npm run dev

# Hoặc chạy riêng biệt
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Production Mode
```bash
# Build frontend
npm run build

# Chạy production
npm start
```

### Kiểm Tra Ứng Dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📱 Hướng Dẫn Sử Dụng

### Cho Người Dùng:

#### 1. Đăng Ký Whitelist
1. Truy cập website
2. Click **"Đăng Nhập Steam"**
3. Đăng nhập Steam account
4. Click **"Kết Nối Discord"**
5. Authorize Discord application
6. Điền form đăng ký:
   - **Tên nhân vật**
   - **Tuổi nhân vật**
   - **Nghề nghiệp**
   - **Câu chuyện background**
7. Click **"Gửi Đơn Đăng Ký"**

#### 2. Theo Dõi Trạng Thái
1. Vào trang **"Lịch Sử Đơn"**
2. Xem trạng thái đơn đăng ký:
   - 🟡 **Đang chờ**: Đơn đang được xem xét
   - 🟢 **Đã duyệt**: Đơn được chấp nhận
   - 🔴 **Từ chối**: Đơn bị từ chối (có lý do)

### Cho Admin/Moderator:

#### 1. Xử Lý Đơn Đăng Ký
1. Kiểm tra Discord channel webhook
2. Xem thông tin đơn đăng ký
3. Click nút **"Duyệt"** hoặc **"Từ chối"**
4. Nhập lý do (nếu từ chối)
5. Hệ thống tự động cập nhật database

#### 2. Quản Lý Permissions
- Chỉ user có role moderator mới có thể duyệt đơn
- Role ID được cấu hình trong `DISCORD_MODERATOR_ROLE_ID`

---

## 🚀 Deploy Production

### Tùy Chọn 1: Railway (Khuyến Nghị)

#### Bước 1: Chuẩn Bị
1. Tạo tài khoản [Railway](https://railway.app)
2. Connect GitHub account
3. Fork repository về GitHub account của bạn

#### Bước 2: Deploy
1. Vào Railway dashboard
2. Click **"New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Chọn repository đã fork
5. Railway sẽ tự động detect và deploy

#### Bước 3: Cấu Hình Environment Variables
1. Vào project settings → **Variables**
2. Thêm tất cả environment variables từ file `.env`
3. **Quan trọng**: Cập nhật các URL:
   ```env
   FRONTEND_URL=https://your-app.up.railway.app
   DISCORD_REDIRECT_URI=https://your-app.up.railway.app/auth/discord/callback
   ```

#### Bước 4: Cập Nhật Discord Application
1. Vào Discord Developer Portal
2. Cập nhật Redirect URLs với domain Railway
3. Cập nhật Webhook URLs nếu cần

### Tùy Chọn 2: Heroku
```bash
# Cài đặt Heroku CLI
npm install -g heroku

# Login Heroku
heroku login

# Tạo app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
# ... thêm tất cả env vars

# Deploy
git push heroku main
```

### Tùy Chọn 3: VPS/Server Riêng
```bash
# Trên server
git clone https://github.com/your-username/Whitelist-Web.git
cd Whitelist-Web

# Cài đặt dependencies
npm run install-all

# Cấu hình environment
cp .env.example .env
# Chỉnh sửa .env với thông tin production

# Build frontend
npm run build

# Cài đặt PM2 (Process Manager)
npm install -g pm2

# Chạy với PM2
pm2 start server/server.js --name "whitelist-web"
pm2 startup
pm2 save
```

---

## 🔧 Xử Lý Lỗi Thường Gặp

### 1. Lỗi Database Connection
**Triệu chứng**: `MongoDB connection error`

**Giải pháp**:
- Kiểm tra MONGODB_URI trong .env
- Đảm bảo IP được whitelist trong MongoDB Atlas
- Kiểm tra username/password database
- Thử connection string trên MongoDB Compass

### 2. Lỗi Discord OAuth
**Triệu chứng**: `Discord OAuth error` hoặc redirect không hoạt động

**Giải pháp**:
- Kiểm tra DISCORD_CLIENT_ID và DISCORD_CLIENT_SECRET
- Đảm bảo Redirect URI chính xác trong Discord Developer Portal
- Kiểm tra domain trong OAuth2 settings

### 3. Lỗi Steam Authentication
**Triệu chứng**: Steam login không hoạt động

**Giải pháp**:
- Kiểm tra STEAM_API_KEY
- Đảm bảo domain được đăng ký với Steam API
- Kiểm tra Steam OpenID configuration

### 4. Lỗi Discord Bot
**Triệu chứng**: Bot không online hoặc không gửi webhook

**Giải pháp**:
- Kiểm tra DISCORD_BOT_TOKEN
- Đảm bảo bot có permissions trong server
- Kiểm tra DISCORD_WEBHOOK_URL
- Verify bot intents được bật

### 5. Lỗi Build Frontend
**Triệu chứng**: `npm run build` thất bại

**Giải pháp**:
```bash
# Xóa node_modules và reinstall
rm -rf node_modules client/node_modules
npm run install-all

# Clear npm cache
npm cache clean --force

# Build lại
npm run build
```

### 6. Lỗi Port Already in Use
**Triệu chứng**: `EADDRINUSE: address already in use :::5000`

**Giải pháp**:
```bash
# Tìm process đang sử dụng port
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:5000)

# Hoặc đổi port trong .env
PORT=3001
```

### 7. Lỗi CORS
**Triệu chứng**: `CORS policy` error trong browser

**Giải pháp**:
- Kiểm tra FRONTEND_URL trong .env
- Đảm bảo domain được thêm vào corsOptions trong server.js
- Kiểm tra credentials: true trong CORS config

---

## 📚 Tài Liệu Tham Khảo

### API Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/steam` - Steam authentication
- `GET /api/auth/discord` - Discord OAuth
- `POST /api/applications` - Tạo đơn đăng ký
- `GET /api/applications/history` - Lịch sử đơn đăng ký
- `POST /api/discord/webhook` - Discord webhook handler

### Environment Variables Reference
| Variable | Mô tả | Bắt buộc | Ví dụ |
|----------|-------|----------|-------|
| `NODE_ENV` | Environment mode | Không | `development` |
| `PORT` | Server port | Không | `5000` |
| `MONGODB_URI` | MongoDB connection string | Có | `mongodb+srv://...` |
| `DISCORD_BOT_TOKEN` | Discord bot token | Có | `MTM4MTM4...` |
| `DISCORD_CLIENT_ID` | Discord application ID | Có | `1381383646...` |
| `DISCORD_CLIENT_SECRET` | Discord client secret | Có | `S6inGJZL4-...` |
| `STEAM_API_KEY` | Steam Web API key | Có | `282D20CE0E...` |
| `JWT_SECRET` | JWT signing secret | Có | `your-secret-key` |

### Cấu Trúc Project
```
Whitelist-Web/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── server.js         # Main server file
├── .env.example          # Environment template
├── package.json          # Backend dependencies
└── Hướng Dẫn.md         # Tài liệu này
```

---

## 🆘 Hỗ Trợ

### Liên Hệ
- **GitHub Issues**: [Tạo issue mới](https://github.com/Nguyenlanhuong13a/Whitelist-Web/issues)
- **Discord**: Tham gia server West Roleplay để được hỗ trợ

### Đóng Góp
1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### License
Dự án này được phát hành dưới [MIT License](LICENSE).

---

## 📝 Changelog

### Version 1.0.0
- ✅ Tích hợp Discord OAuth2
- ✅ Tích hợp Steam OpenID
- ✅ Hệ thống whitelist application
- ✅ Discord webhook notifications
- ✅ Responsive UI với glassmorphism design
- ✅ Hỗ trợ tiếng Việt

---

**🎉 Chúc bạn cài đặt thành công West Roleplay Whitelist!**

Nếu gặp bất kỳ vấn đề nào, hãy tham khảo phần [Xử Lý Lỗi Thường Gặp](#xử-lý-lỗi-thường-gặp) hoặc tạo issue trên GitHub.
