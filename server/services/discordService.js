const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const discordBot = require('./discordBot');

class DiscordService {
  constructor() {
    this.webhookChannelId = process.env.DISCORD_WEBHOOK_CHANNEL_ID;
    this.webhookClient = process.env.DISCORD_WEBHOOK_URL
      ? new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL })
      : null;
  }

  isConnected() {
    return discordBot.isConnected();
  }

  getBotUser() {
    return discordBot.getBotUser();
  }

  createApplicationEmbed(application) {
    const embed = new EmbedBuilder()
      .setTitle('🆕 Đơn đăng ký Whitelist mới')
      .setDescription('Một người dùng mới đã gửi đơn đăng ký whitelist')
      .setColor(0x3498db) // Blue color
      .addFields([
        {
          name: '👤 Discord ID',
          value: `\`${application.discordId}\``,
          inline: true
        },
        {
          name: '🎮 Steam ID',
          value: `\`${application.steamId}\``,
          inline: true
        },
        {
          name: '🏷️ Tên nhân vật',
          value: application.characterName,
          inline: true
        },
        {
          name: '🎂 Tuổi',
          value: `${application.age} tuổi`,
          inline: true
        },
        {
          name: '📅 Ngày gửi đơn',
          value: `<t:${Math.floor(application.submittedAt.getTime() / 1000)}:F>`,
          inline: true
        },
        {
          name: '📝 Tiểu sử nhân vật',
          value: application.backstory.length > 1000 
            ? application.backstory.substring(0, 1000) + '...'
            : application.backstory,
          inline: false
        },
        {
          name: '💭 Lý do tham gia',
          value: application.reason.length > 500
            ? application.reason.substring(0, 500) + '...'
            : application.reason,
          inline: false
        }
      ])
      .setFooter({
        text: `Application ID: ${application._id}`,
        iconURL: 'https://cdn.discordapp.com/emojis/1234567890123456789.png' // Optional server icon
      })
      .setTimestamp();

    return embed;
  }

  createActionRow(applicationId) {
    const approveButton = new ButtonBuilder()
      .setCustomId(`approve_${applicationId}`)
      .setLabel('✅ Duyệt')
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject_${applicationId}`)
      .setLabel('❌ Từ chối')
      .setStyle(ButtonStyle.Danger);

    return new ActionRowBuilder()
      .addComponents(approveButton, rejectButton);
  }

  createStatusEmbed(application) {
    let color, statusText, statusEmoji;
    
    switch (application.status) {
      case 'approved':
        color = 0x27ae60; // Green
        statusText = 'Đã duyệt';
        statusEmoji = '✅';
        break;
      case 'rejected':
        color = 0xe74c3c; // Red
        statusText = 'Từ chối';
        statusEmoji = '❌';
        break;
      default:
        color = 0xf39c12; // Orange
        statusText = 'Đang xem xét';
        statusEmoji = '⏳';
    }

    const embed = new EmbedBuilder()
      .setTitle(`${statusEmoji} Đơn đăng ký Whitelist - ${statusText}`)
      .setColor(color)
      .addFields([
        {
          name: '👤 Discord ID',
          value: `\`${application.discordId}\``,
          inline: true
        },
        {
          name: '🏷️ Tên nhân vật',
          value: application.characterName,
          inline: true
        },
        {
          name: '📊 Trạng thái',
          value: `${statusEmoji} ${statusText}`,
          inline: true
        }
      ])
      .setFooter({
        text: `Application ID: ${application._id}`,
      })
      .setTimestamp();

    // Add review information if available
    if (application.reviewedAt && application.reviewedBy) {
      embed.addFields([
        {
          name: '👨‍💼 Người xem xét',
          value: application.reviewedBy.username || 'Unknown',
          inline: true
        },
        {
          name: '📅 Ngày xem xét',
          value: `<t:${Math.floor(application.reviewedAt.getTime() / 1000)}:F>`,
          inline: true
        }
      ]);
    }

    // Add feedback if available
    if (application.feedback) {
      embed.addFields([
        {
          name: '💬 Phản hồi',
          value: application.feedback,
          inline: false
        }
      ]);
    }

    return embed;
  }

  async sendApplicationNotification(application) {
    try {
      // Skip Discord notification in demo mode
      if (process.env.DEMO_MODE === 'true') {
        console.log(`🎭 DEMO MODE: Would send Discord notification for application ${application._id}`);
        console.log(`   Discord ID: ${application.discordId}`);
        console.log(`   Character: ${application.characterName}`);
        return { id: 'demo_message_id', channel: { id: 'demo_channel_id' } };
      }

      const embed = this.createApplicationEmbed(application);

      // Try bot method first (with interactive buttons)
      if (this.isConnected() && this.webhookChannelId) {
        try {
          const actionRow = this.createActionRow(application._id);
          const message = await discordBot.sendMessage(this.webhookChannelId, {
            embeds: [embed],
            components: [actionRow]
          });
          console.log(`✅ Discord bot notification sent for application ${application._id}`);
          return message;
        } catch (botError) {
          console.warn('Bot notification failed, trying webhook fallback:', botError.message);
        }
      }

      // Fallback to webhook method (without interactive buttons)
      if (this.webhookClient) {
        const message = await this.webhookClient.send({
          embeds: [embed],
          content: `🆕 **Đơn đăng ký Whitelist mới** - Application ID: \`${application._id}\`\n\n⚠️ *Sử dụng lệnh manual để duyệt/từ chối đơn này vì bot không khả dụng.*`
        });
        console.log(`✅ Discord webhook notification sent for application ${application._id}`);
        return { id: message.id, channel: { id: 'webhook_channel' } };
      }

      throw new Error('No Discord notification method available (neither bot nor webhook)');

    } catch (error) {
      console.error('Failed to send Discord notification:', error);
      throw error;
    }
  }

  async updateApplicationMessage(application, originalMessage = null) {
    try {
      if (!this.isConnected()) {
        throw new Error('Discord bot is not connected');
      }

      const embed = this.createStatusEmbed(application);

      // Remove action buttons since the application has been processed
      const messageOptions = {
        embeds: [embed],
        components: []
      };

      let updatedMessage;
      
      if (originalMessage && originalMessage.id) {
        // Update the original message if provided
        updatedMessage = await discordBot.editMessage(
          originalMessage.channel_id,
          originalMessage.id,
          messageOptions
        );
      } else if (application.discordMessageId && application.discordChannelId) {
        // Update using stored message info
        updatedMessage = await discordBot.editMessage(
          application.discordChannelId,
          application.discordMessageId,
          messageOptions
        );
      } else {
        throw new Error('No message information available for update');
      }

      console.log(`✅ Discord message updated for application ${application._id}`);
      return updatedMessage;

    } catch (error) {
      console.error('Failed to update Discord message:', error);
      throw error;
    }
  }

  async updateApplicationMessageById(application) {
    return this.updateApplicationMessage(application);
  }

  async sendTestMessage(channelId = null) {
    try {
      const embed = new EmbedBuilder()
        .setTitle('🧪 Test Message')
        .setDescription('This is a test message from the Whitelist Web application')
        .setColor(0x9b59b6) // Purple
        .addFields([
          {
            name: '🤖 Bot Status',
            value: this.isConnected() ? 'Bot connected and working!' : 'Using webhook fallback',
            inline: true
          },
          {
            name: '⏰ Timestamp',
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          },
          {
            name: '📡 Method',
            value: this.isConnected() ? 'Discord Bot' : 'Webhook',
            inline: true
          }
        ])
        .setFooter({
          text: 'Whitelist Web System'
        })
        .setTimestamp();

      // Try bot method first
      if (this.isConnected() && (channelId || this.webhookChannelId)) {
        try {
          const targetChannelId = channelId || this.webhookChannelId;
          const message = await discordBot.sendMessage(targetChannelId, {
            embeds: [embed]
          });
          console.log(`✅ Test message sent via bot to channel ${targetChannelId}`);
          return message;
        } catch (botError) {
          console.warn('Bot test message failed, trying webhook:', botError.message);
        }
      }

      // Fallback to webhook
      if (this.webhookClient) {
        const message = await this.webhookClient.send({
          embeds: [embed],
          content: '🧪 **Test Message** - Webhook integration working!'
        });
        console.log(`✅ Test message sent via webhook`);
        return { id: message.id, channel: { id: 'webhook_channel' } };
      }

      throw new Error('No Discord method available for test message');

    } catch (error) {
      console.error('Failed to send test message:', error);
      throw error;
    }
  }
}

// Create singleton instance
const discordService = new DiscordService();

module.exports = discordService;
