const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testSetup() {
  console.log('🧪 Testing Whitelist Web Setup...\n');

  // Test 1: Environment Variables
  console.log('1. Checking Environment Variables:');
  const requiredEnvVars = [
    'MONGODB_URI'
  ];

  const discordEnvVars = [
    'DISCORD_BOT_TOKEN',
    'DISCORD_WEBHOOK_CHANNEL_ID',
    'DISCORD_WEBHOOK_URL'
  ];

  let envVarsOk = true;
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      console.log(`   ✅ ${envVar}: Set`);
    } else {
      console.log(`   ❌ ${envVar}: Missing`);
      envVarsOk = false;
    }
  });

  // Check Discord variables (at least one method should be available)
  let discordMethodAvailable = false;
  discordEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      console.log(`   ✅ ${envVar}: Set`);
      discordMethodAvailable = true;
    } else {
      console.log(`   ⚠️ ${envVar}: Missing`);
    }
  });

  if (!discordMethodAvailable) {
    console.log('   ❌ No Discord integration method available');
    console.log('   Please set either DISCORD_BOT_TOKEN or DISCORD_WEBHOOK_URL');
    envVarsOk = false;
  }

  if (!envVarsOk) {
    console.log('\n❌ Please set all required environment variables in .env file');
    console.log('   Copy .env.example to .env and fill in the values');
    process.exit(1);
  }

  // Test 2: Database Connection
  console.log('\n2. Testing Database Connection:');
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whitelist-web';
    await mongoose.connect(mongoURI);
    console.log('   ✅ MongoDB connection successful');
    await mongoose.connection.close();
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
    console.log('   Make sure MongoDB is running or check your MONGODB_URI');
  }

  // Test 3: Discord Bot Token Format
  console.log('\n3. Checking Discord Bot Token Format:');
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (botToken && botToken.length > 50 && botToken.includes('.')) {
    console.log('   ✅ Discord bot token format looks valid');
  } else {
    console.log('   ❌ Discord bot token format looks invalid');
    console.log('   Make sure you copied the bot token correctly from Discord Developer Portal');
  }

  // Test 4: Discord Channel ID Format
  console.log('\n4. Checking Discord Channel ID Format:');
  const channelId = process.env.DISCORD_WEBHOOK_CHANNEL_ID;
  if (channelId && /^\d{17,19}$/.test(channelId)) {
    console.log('   ✅ Discord channel ID format looks valid');
  } else {
    console.log('   ❌ Discord channel ID format looks invalid');
    console.log('   Make sure you copied the channel ID correctly (should be 17-19 digits)');
  }

  // Test 5: Required Dependencies
  console.log('\n5. Checking Required Dependencies:');
  const requiredDeps = [
    'express',
    'mongoose',
    'discord.js',
    'cors',
    'dotenv',
    'express-validator'
  ];

  requiredDeps.forEach(dep => {
    try {
      require(dep);
      console.log(`   ✅ ${dep}: Available`);
    } catch (error) {
      console.log(`   ❌ ${dep}: Missing - run 'npm install'`);
    }
  });

  console.log('\n🎉 Setup test completed!');
  console.log('\nNext steps:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Invite your Discord bot to your server with proper permissions');
  console.log('3. Run "npm run dev" to start the development server');
  console.log('4. Test the application by submitting a form at http://localhost:3000');
}

// Run the test
testSetup().catch(error => {
  console.error('❌ Setup test failed:', error);
  process.exit(1);
});
