const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testButtonInteraction() {
  try {
    console.log('🧪 Testing Discord Button Interaction Setup...');
    
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
      .setTitle('🧪 Test Button Interaction')
      .setDescription('This is a test message to verify button interactions are working.')
      .setColor(0x3498db)
      .addFields(
        { name: 'Test ID', value: 'test_' + Date.now(), inline: true },
        { name: 'Status', value: 'Testing', inline: true }
      )
      .setTimestamp();

    // Create action buttons
    const approveButton = new ButtonBuilder()
      .setCustomId(`approve_test_${Date.now()}`)
      .setLabel('✅ Test Approve')
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject_test_${Date.now()}`)
      .setLabel('❌ Test Reject')
      .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder()
      .addComponents(approveButton, rejectButton);

    // Send test message with buttons
    const message = await webhookClient.send({
      embeds: [embed],
      components: [actionRow],
      content: '🧪 **Button Interaction Test**\n\nClick the buttons below to test if the Discord bot can handle interactions properly.'
    });

    console.log('✅ Test message with buttons sent successfully!');
    console.log(`   Message ID: ${message.id}`);
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Go to your Discord channel');
    console.log('2. Find the test message with buttons');
    console.log('3. Click either "Test Approve" or "Test Reject"');
    console.log('4. Check the server console for interaction logs');
    console.log('');
    console.log('Expected behavior:');
    console.log('- You should see "🔘 Button interaction received: approve_test_..." in server logs');
    console.log('- You should get an ephemeral response message');
    console.log('- If it says "Application not found", that\'s expected for test buttons');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testButtonInteraction();
