const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testRejectionReasonFeature() {
  try {
    console.log('🧪 Testing Discord Rejection Reason Feature...');
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

    // Create test embed that simulates a real application
    const embed = new EmbedBuilder()
      .setTitle('🆕 Đơn đăng ký Whitelist mới')
      .setDescription('Test application for rejection reason feature')
      .setColor(0xf39c12)
      .addFields([
        { name: '👤 Discord ID', value: '`123456789012345678`', inline: true },
        { name: '🎮 Steam ID', value: '`steam:110000123456789`', inline: true },
        { name: '🏷️ Tên nhân vật', value: 'Test Character', inline: true },
        { name: '🎂 Tuổi', value: '25 tuổi', inline: true },
        { name: '📅 Ngày gửi đơn', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        { name: '📋 Trạng thái', value: '⏳ Đang xem xét', inline: true },
        { name: '📖 Tiểu sử nhân vật', value: 'This is a test backstory for testing the rejection reason feature. The character has a detailed background story.', inline: false },
        { name: '💭 Lý do tham gia', value: 'Testing the new rejection reason modal feature', inline: false }
      ])
      .setFooter({
        text: `Application ID: test_rejection_${Date.now()}`,
      })
      .setTimestamp();

    // Create test buttons with fake application ID
    const testApplicationId = `test_rejection_${Date.now()}`;
    
    const approveButton = new ButtonBuilder()
      .setCustomId(`approve_${testApplicationId}`)
      .setLabel('✅ Duyệt')
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject_${testApplicationId}`)
      .setLabel('❌ Từ chối')
      .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder()
      .addComponents(approveButton, rejectButton);

    // Send test message with buttons
    const message = await webhookClient.send({
      embeds: [embed],
      components: [actionRow],
      content: `🧪 **Rejection Reason Feature Test**\n\n**Required Role:** <@&${process.env.DISCORD_MODERATOR_ROLE_ID}>\n\nTest the new rejection reason modal by clicking the "Từ chối" button below.`
    });

    console.log('✅ Rejection reason test message sent successfully!');
    console.log(`   Message ID: ${message.id}`);
    console.log(`   Test Application ID: ${testApplicationId}`);
    console.log('');
    console.log('📋 Test Instructions:');
    console.log('1. Go to your Discord channel and find the test message');
    console.log('2. Click the "❌ Từ chối" (Reject) button');
    console.log('3. A modal should appear asking for rejection reason');
    console.log('4. Enter a test rejection reason (or leave empty)');
    console.log('5. Submit the modal');
    console.log('6. Check the server console for logs');
    console.log('');
    console.log('✅ Expected Results:');
    console.log('   - Modal appears with text input for rejection reason');
    console.log('   - After submission: "❌ Không tìm thấy đơn đăng ký." (expected for test)');
    console.log('   - Console logs show rejection reason processing');
    console.log('');
    console.log('🔍 Features to Test:');
    console.log('   ✓ Modal appears when reject button is clicked');
    console.log('   ✓ Text input accepts rejection reason (up to 1000 characters)');
    console.log('   ✓ Rejection reason is optional (can be empty)');
    console.log('   ✓ Role-based permission checking still works');
    console.log('   ✓ Proper error handling and user feedback');
    console.log('');
    console.log('📝 Try different test scenarios:');
    console.log('   - Empty rejection reason');
    console.log('   - Short rejection reason');
    console.log('   - Long rejection reason (multiple lines)');
    console.log('   - Special characters and Vietnamese text');

  } catch (error) {
    console.error('❌ Rejection reason test failed:', error.message);
  }
}

// Run the test
testRejectionReasonFeature();
