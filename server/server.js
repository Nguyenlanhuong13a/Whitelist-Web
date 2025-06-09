const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const applicationRoutes = require('./routes/applications');
const discordRoutes = require('./routes/discord');
const authRoutes = require('./routes/auth');

// Import Discord bot
const discordBot = require('./services/discordBot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://whitelistweb.up.railway.app',
        process.env.FRONTEND_URL,
        process.env.RAILWAY_STATIC_URL,
        process.env.RENDER_EXTERNAL_URL
      ].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path.includes('/api/')) {
    console.log('📦 Request body keys:', Object.keys(req.body || {}));
  }
  next();
});

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatusText,
      readyState: dbStatus,
      connected: dbStatus === 1
    },
    discord: {
      botConnected: discordBot.isConnected(),
      webhookConfigured: !!process.env.DISCORD_WEBHOOK_URL
    }
  });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whitelist-web';
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 MongoDB URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials in logs

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });

    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('📋 Full error details:', error);
    console.log('⚠️ Server will continue without database (Discord integration will still work)');
    return false;
  }
};

// Initialize Discord bot
const initializeDiscordBot = async () => {
  try {
    await discordBot.initialize();
    console.log('✅ Discord bot initialized successfully');
  } catch (error) {
    console.error('❌ Discord bot initialization error:', error);
    // Don't exit process, allow server to run without Discord functionality
  }
};

// Start server
const startServer = async () => {
  try {
    // Try to connect to database (optional)
    const dbConnected = await connectDB();

    // Initialize Discord bot
    await initializeDiscordBot();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💾 Database: ${dbConnected ? 'Connected' : 'Disconnected (Discord still works)'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
    if (discordBot.client) {
      discordBot.client.destroy();
      console.log('✅ Discord bot disconnected');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();
