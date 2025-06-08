# FiveM Whitelist Web Application

A comprehensive web application for managing FiveM server whitelist applications with Discord integration.

## Features

- **Web Application Form**: User-friendly interface for submitting whitelist applications
- **Discord Integration**: Automatic notifications to Discord with interactive approval/rejection buttons
- **Rejection Reason System**: Moderators can provide detailed feedback when rejecting applications
- **Status Checking**: Real-time status checking for submitted applications with rejection reasons
- **Role-Based Permissions**: Discord role-based access control for moderator actions
- **Database Storage**: MongoDB integration for persistent data storage
- **Vietnamese Language Support**: Full Vietnamese language interface

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Discord Integration**: Discord.js v14
- **Styling**: Tailwind CSS with custom glass morphism design

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Discord Bot Application

### 1. Clone and Install

```bash
git clone <repository-url>
cd whitelist-web
npm run install-all
```

### 2. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token
5. Enable necessary bot permissions:
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History
6. Invite the bot to your Discord server with appropriate permissions

### 3. Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in the required environment variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/whitelist-web

# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_WEBHOOK_CHANNEL_ID=your_discord_channel_id_here
```

### 4. Database Setup

Make sure MongoDB is running on your system or provide a cloud MongoDB URI.

### 5. Start the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

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
