const { WebhookClient, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testDiscordWebhook() {
  try {
    console.log('🧪 Testing Discord Webhook...');
    
    if (!process.env.DISCORD_WEBHOOK_URL) {
      console.log('❌ DISCORD_WEBHOOK_URL not found in environment variables');
      return;
    }
    
    // Create webhook client
    const webhookClient = new WebhookClient({ 
      url: process.env.DISCORD_WEBHOOK_URL 
    });
    
    // Create test embed
    const embed = new EmbedBuilder()
      .setTitle('🧪 Webhook Test')
      .setDescription('Testing Discord webhook integration for Whitelist Web')
      .setColor(0x00ff00) // Green
      .addFields([
        {
          name: '📡 Method',
          value: 'Discord Webhook',
          inline: true
        },
        {
          name: '⏰ Timestamp',
          value: new Date().toLocaleString('vi-VN'),
          inline: true
        },
        {
          name: '✅ Status',
          value: 'Webhook working correctly!',
          inline: false
        }
      ])
      .setFooter({
        text: 'Whitelist Web System - Test Message'
      })
      .setTimestamp();
    
    // Send test message
    const message = await webhookClient.send({
      content: '🎉 **Discord Webhook Test** - Hệ thống whitelist web đã kết nối thành công!',
      embeds: [embed]
    });
    
    console.log('✅ Test message sent successfully!');
    console.log(`   Message ID: ${message.id}`);
    console.log(`   Webhook URL: ${process.env.DISCORD_WEBHOOK_URL.split('/').slice(0, -1).join('/')}/***`);
    
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
    
    if (error.code === 10015) {
      console.log('   The webhook URL is invalid or the webhook has been deleted');
    } else if (error.code === 50001) {
      console.log('   Missing access to the channel or webhook');
    } else if (error.code === 50013) {
      console.log('   Missing permissions to send messages');
    }
  }
}

// Run the test
testDiscordWebhook();
