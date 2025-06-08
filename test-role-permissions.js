const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testRolePermissions() {
  try {
    console.log('🧪 Testing Discord Role-Based Permission System...');
    console.log('');
    
    if (!process.env.DISCORD_WEBHOOK_URL) {
      console.log('❌ DISCORD_WEBHOOK_URL not found in environment variables');
      return;
    }

    if (!process.env.DISCORD_MODERATOR_ROLE_ID) {
      console.log('❌ DISCORD_MODERATOR_ROLE_ID not found in environment variables');
      console.log('   Please add DISCORD_MODERATOR_ROLE_ID to your .env file');
      return;
    }
    
    console.log(`✅ Moderator Role ID configured: ${process.env.DISCORD_MODERATOR_ROLE_ID}`);
    console.log('');
    
    // Create webhook client
    const webhookClient = new WebhookClient({ 
      url: process.env.DISCORD_WEBHOOK_URL 
    });

    // Create test embed
    const embed = new EmbedBuilder()
      .setTitle('🔐 Role Permission Test')
      .setDescription('This message tests the role-based permission system for Discord button interactions.')
      .setColor(0xe74c3c)
      .addFields(
        { name: '🎭 Required Role ID', value: process.env.DISCORD_MODERATOR_ROLE_ID, inline: true },
        { name: '📋 Test Instructions', value: 'Click buttons below to test permissions', inline: true },
        { name: '⚠️ Expected Behavior', value: 'Only users with the moderator role should be able to use these buttons', inline: false }
      )
      .setTimestamp();

    // Create test buttons with fake application IDs
    const approveButton = new ButtonBuilder()
      .setCustomId(`approve_permission_test_${Date.now()}`)
      .setLabel('🔐 Test Approve Permission')
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject_permission_test_${Date.now()}`)
      .setLabel('🔐 Test Reject Permission')
      .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder()
      .addComponents(approveButton, rejectButton);

    // Send test message with buttons
    const message = await webhookClient.send({
      embeds: [embed],
      components: [actionRow],
      content: `🔐 **Role Permission Test**\n\n**Required Role:** <@&${process.env.DISCORD_MODERATOR_ROLE_ID}>\n\nOnly users with the above role should be able to click these buttons successfully.`
    });

    console.log('✅ Role permission test message sent successfully!');
    console.log(`   Message ID: ${message.id}`);
    console.log('');
    console.log('📋 Test Instructions:');
    console.log('1. Go to your Discord channel and find the role permission test message');
    console.log('2. Have users WITH the moderator role click the buttons');
    console.log('3. Have users WITHOUT the moderator role click the buttons');
    console.log('4. Check the server console for permission check logs');
    console.log('');
    console.log('✅ Expected Results for Users WITH Moderator Role:');
    console.log('   - Should see: "❌ Không tìm thấy đơn đăng ký." (expected for test buttons)');
    console.log('   - Console: "✅ User [username] has moderator role - permission granted"');
    console.log('');
    console.log('❌ Expected Results for Users WITHOUT Moderator Role:');
    console.log('   - Should see: "❌ Bạn không có quyền thực hiện hành động này..."');
    console.log('   - Console: "❌ User [username] does not have moderator role - permission denied"');
    console.log('');
    console.log('🔍 Monitor server console logs for detailed permission checking information.');

  } catch (error) {
    console.error('❌ Role permission test failed:', error.message);
  }
}

// Run the test
testRolePermissions();
