# West Roleplay Whitelist Web Application

A comprehensive web application for managing West Roleplay server whitelist applications with Discord and Steam integration.

## 📖 Documentation

- **🇻🇳 [Hướng Dẫn Tiếng Việt](Hướng%20Dẫn.md)** - Complete Vietnamese setup guide
- **🔒 [Security Cleanup Report](SECURITY-CLEANUP.md)** - Information about security measures

## Features

- **Web Application Form**: User-friendly interface for submitting whitelist applications
- **Discord OAuth2 Integration**: Secure Discord authentication for user identification
- **Steam OpenID Integration**: Steam account verification and authentication
- **Discord Bot Integration**: Automatic notifications to Discord with interactive approval/rejection buttons
- **Rejection Reason System**: Moderators can provide detailed feedback when rejecting applications
- **Application History**: Users can track all their application submissions and statuses
- **Status Checking**: Real-time status checking for submitted applications with rejection reasons
- **Role-Based Permissions**: Discord role-based access control for moderator actions
- **Database Storage**: MongoDB Atlas integration for persistent data storage
- **Vietnamese Language Support**: Full Vietnamese language interface
- **Responsive Design**: Glassmorphism design that works on all devices

## Tech Stack

- **Frontend**: React.js 19+ with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: Discord OAuth2 + Steam OpenID
- **Discord Integration**: Discord.js v14 with webhooks
- **Styling**: Tailwind CSS with custom glassmorphism design
- **Deployment**: Railway (recommended) / Heroku / VPS

## 🚀 Quick Start

> **⚠️ Important**: This repository has been cleaned of sensitive information. You must configure your own credentials.

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- MongoDB Atlas account (recommended) or local MongoDB
- Discord Developer Account
- Steam Developer Account

### Quick Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/Nguyenlanhuong13a/Whitelist-Web.git
   cd Whitelist-Web
   npm run install-all
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   cp client/.env.example client/.env
   # Edit .env files with your credentials
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

### 📚 Complete Setup Guide

For detailed setup instructions including:
- Discord application configuration
- Steam API setup
- MongoDB Atlas configuration
- Production deployment
- Troubleshooting

**👉 See the complete Vietnamese guide: [Hướng Dẫn.md](Hướng%20Dẫn.md)**

## API Endpoints

### Applications
- `POST /api/applications` - Submit new application
- `GET /api/applications/status/:discordId` - Check application status
- `GET /api/applications/stats` - Get application statistics
- `GET /api/applications` - List all applications (admin)

### Discord Integration
- `POST /api/discord/interactions` - Handle Discord button interactions
- `POST /api/discord/update-status` - Manual status update
- `GET /api/discord/test` - Test Discord connection

## Discord Integration Flow

1. User submits application through web form
2. Application is saved to MongoDB
3. Discord notification is sent to configured channel with embed and buttons
4. Admin clicks "Approve" or "Reject" button in Discord
5. **For Rejections**: Modal appears asking for rejection reason (optional)
6. Application status is updated in database with feedback
7. Discord message is updated to show new status and rejection reason
8. User can check status through web interface and see rejection feedback

## Application Status System

- **Đang xem xét** (Pending): Initial status when application is submitted
- **Đã duyệt** (Approved): Application has been approved
- **Từ chối** (Rejected): Application has been rejected with optional feedback

## Development

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── ...
├── server/                 # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── server.js          # Main server file
├── package.json           # Root package.json
└── README.md
```

### Adding New Features

1. Backend changes go in `server/` directory
2. Frontend changes go in `client/src/` directory
3. Database models are in `server/models/`
4. API routes are in `server/routes/`
5. Discord integration is in `server/services/`

## Troubleshooting

### Common Issues

1. **Discord bot not responding**: Check bot token and permissions
2. **Database connection failed**: Verify MongoDB URI and connection
3. **Frontend not loading**: Ensure both client and server are running
4. **Discord notifications not sending**: Check channel ID and bot permissions

### Logs

Check console output for detailed error messages and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
