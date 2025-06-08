const { Client, GatewayIntentBits, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

class DiscordBot {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  async initialize() {
    try {
      // Check if running in demo mode
      if (process.env.DEMO_MODE === 'true') {
        console.log('🎭 Running in DEMO MODE - Discord bot disabled');
        this.isReady = true;
        return null;
      }

      // Check if bot token is provided
      if (!process.env.DISCORD_BOT_TOKEN) {
        throw new Error('DISCORD_BOT_TOKEN environment variable is required');
      }

      // Create Discord client
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages
        ]
      });

      // Set up event handlers
      this.setupEventHandlers();

      // Login to Discord
      await this.client.login(process.env.DISCORD_BOT_TOKEN);

      // Wait for the bot to be ready
      await this.waitForReady();

      return this.client;
    } catch (error) {
      console.error('Failed to initialize Discord bot:', error);
      throw error;
    }
  }

  setupEventHandlers() {
    this.client.once(Events.ClientReady, (readyClient) => {
      console.log(`✅ Discord bot logged in as ${readyClient.user.tag}`);
      this.isReady = true;
    });

    this.client.on(Events.Error, (error) => {
      console.error('Discord client error:', error);
    });

    this.client.on(Events.Warn, (warning) => {
      console.warn('Discord client warning:', warning);
    });

    this.client.on(Events.Debug, (info) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Discord debug:', info);
      }
    });

    // Handle interactions (buttons and modals)
    this.client.on(Events.InteractionCreate, async (interaction) => {
      try {
        if (interaction.isButton()) {
          console.log(`🔘 Button interaction received: ${interaction.customId}`);
          await this.handleButtonInteraction(interaction);
        } else if (interaction.isModalSubmit()) {
          console.log(`📝 Modal submission received: ${interaction.customId}`);
          await this.handleModalSubmission(interaction);
        }
      } catch (error) {
        console.error('Error handling interaction:', error);

        // Try to respond with error message if possible
        try {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: '❌ Có lỗi xảy ra khi xử lý yêu cầu của bạn.',
              flags: 64 // Ephemeral flag
            });
          }
        } catch (replyError) {
          console.error('Failed to send error reply:', replyError);
        }
      }
    });

    // Handle reconnection
    this.client.on(Events.ShardReconnecting, () => {
      console.log('🔄 Discord bot reconnecting...');
      this.isReady = false;
    });

    this.client.on(Events.ShardReady, () => {
      console.log('✅ Discord bot reconnected');
      this.isReady = true;
    });

    this.client.on(Events.ShardDisconnect, () => {
      console.log('❌ Discord bot disconnected');
      this.isReady = false;
    });
  }

  async waitForReady(timeout = 30000) {
    return new Promise((resolve, reject) => {
      if (this.isReady) {
        return resolve();
      }

      const timer = setTimeout(() => {
        reject(new Error('Discord bot ready timeout'));
      }, timeout);

      const checkReady = () => {
        if (this.isReady) {
          clearTimeout(timer);
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }

  getClient() {
    if (!this.client || !this.isReady) {
      throw new Error('Discord bot is not ready');
    }
    return this.client;
  }

  isConnected() {
    if (process.env.DEMO_MODE === 'true') {
      return false; // Return false in demo mode to skip Discord operations
    }
    return this.client && this.isReady;
  }

  getBotUser() {
    if (!this.isConnected()) {
      return null;
    }
    
    return {
      id: this.client.user.id,
      username: this.client.user.username,
      tag: this.client.user.tag,
      avatar: this.client.user.displayAvatarURL()
    };
  }

  async getChannel(channelId) {
    try {
      const client = this.getClient();
      const channel = await client.channels.fetch(channelId);
      
      if (!channel) {
        throw new Error(`Channel ${channelId} not found`);
      }
      
      if (!channel.isTextBased()) {
        throw new Error(`Channel ${channelId} is not a text channel`);
      }
      
      return channel;
    } catch (error) {
      console.error(`Failed to get channel ${channelId}:`, error);
      throw error;
    }
  }

  async sendMessage(channelId, options) {
    try {
      const channel = await this.getChannel(channelId);
      return await channel.send(options);
    } catch (error) {
      console.error(`Failed to send message to channel ${channelId}:`, error);
      throw error;
    }
  }

  async editMessage(channelId, messageId, options) {
    try {
      const channel = await this.getChannel(channelId);
      const message = await channel.messages.fetch(messageId);
      
      if (!message) {
        throw new Error(`Message ${messageId} not found in channel ${channelId}`);
      }
      
      return await message.edit(options);
    } catch (error) {
      console.error(`Failed to edit message ${messageId} in channel ${channelId}:`, error);
      throw error;
    }
  }

  async deleteMessage(channelId, messageId) {
    try {
      const channel = await this.getChannel(channelId);
      const message = await channel.messages.fetch(messageId);
      
      if (!message) {
        throw new Error(`Message ${messageId} not found in channel ${channelId}`);
      }
      
      return await message.delete();
    } catch (error) {
      console.error(`Failed to delete message ${messageId} in channel ${channelId}:`, error);
      throw error;
    }
  }

  async handleButtonInteraction(interaction) {
    const { customId } = interaction;

    // Extract application ID from custom_id (format: "approve_<applicationId>" or "reject_<applicationId>")
    const [action, applicationId] = customId.split('_');

    if (!['approve', 'reject'].includes(action) || !applicationId) {
      await interaction.reply({
        content: '❌ Hành động không hợp lệ.',
        flags: 64 // Ephemeral flag
      });
      return;
    }

    // Check if user has the required moderator role
    const hasPermission = await this.checkModeratorPermission(interaction);
    if (!hasPermission) {
      await interaction.reply({
        content: '❌ Bạn không có quyền thực hiện hành động này. Chỉ có moderator mới có thể duyệt hoặc từ chối đơn đăng ký.',
        flags: 64 // Ephemeral flag
      });
      return;
    }

    // Import Application model here to avoid circular dependency
    const Application = require('../models/Application');

    try {
      // Find the application
      const application = await Application.findById(applicationId);

      if (!application) {
        await interaction.reply({
          content: '❌ Không tìm thấy đơn đăng ký.',
          flags: 64 // Ephemeral flag
        });
        return;
      }

      // Check if application is still pending
      if (application.status !== 'pending') {
        await interaction.reply({
          content: `❌ Đơn đăng ký này đã được ${application.status === 'approved' ? 'duyệt' : 'từ chối'}.`,
          flags: 64 // Ephemeral flag
        });
        return;
      }

      // Get reviewer information
      const reviewer = {
        discordId: interaction.user.id,
        username: interaction.user.username
      };

      // Handle approve vs reject differently
      if (action === 'approve') {
        // Direct approval
        await application.approve(reviewer);
        const statusMessage = `✅ Đơn đăng ký đã được duyệt bởi ${reviewer.username}`;

        // Update the Discord message to show the new status
        try {
          const discordService = require('./discordService');
          await discordService.updateApplicationMessage(application, interaction.message);
        } catch (updateError) {
          console.error('Failed to update Discord message:', updateError);
        }

        // Respond to the interaction
        await interaction.reply({
          content: statusMessage,
          flags: 64 // Ephemeral flag
        });

        console.log(`✅ Application ${applicationId} approved by ${reviewer.username}`);

      } else if (action === 'reject') {
        // Show modal for rejection reason
        await this.showRejectionReasonModal(interaction, applicationId);
      }

    } catch (error) {
      console.error('Button interaction error:', error);
      await interaction.reply({
        content: '❌ Có lỗi xảy ra khi xử lý yêu cầu của bạn.',
        flags: 64 // Ephemeral flag
      });
    }
  }

  async showRejectionReasonModal(interaction, applicationId) {
    try {
      // Create the modal
      const modal = new ModalBuilder()
        .setCustomId(`rejection_modal_${applicationId}`)
        .setTitle('Lý do từ chối đơn đăng ký');

      // Create the text input for rejection reason
      const reasonInput = new TextInputBuilder()
        .setCustomId('rejection_reason')
        .setLabel('Lý do từ chối (tùy chọn)')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Nhập lý do từ chối đơn đăng ký này...\nVí dụ: Thiếu thông tin, không đủ tuổi, vi phạm quy định, v.v.')
        .setRequired(false)
        .setMaxLength(1000);

      // Add the input to an action row
      const actionRow = new ActionRowBuilder().addComponents(reasonInput);
      modal.addComponents(actionRow);

      // Show the modal
      await interaction.showModal(modal);
      console.log(`📝 Rejection reason modal shown for application ${applicationId}`);

    } catch (error) {
      console.error('Error showing rejection reason modal:', error);

      // Fallback: reject without reason
      await interaction.reply({
        content: '❌ Không thể hiển thị form lý do từ chối. Đơn đăng ký sẽ bị từ chối không có lý do.',
        flags: 64 // Ephemeral flag
      });

      // Proceed with rejection without reason
      await this.processRejection(interaction, applicationId, '');
    }
  }

  async handleModalSubmission(interaction) {
    const { customId } = interaction;

    // Check if this is a rejection reason modal
    if (customId.startsWith('rejection_modal_')) {
      const applicationId = customId.replace('rejection_modal_', '');

      // Check permissions first
      const hasPermission = await this.checkModeratorPermission(interaction);
      if (!hasPermission) {
        await interaction.reply({
          content: '❌ Bạn không có quyền thực hiện hành động này. Chỉ có moderator mới có thể từ chối đơn đăng ký.',
          flags: 64 // Ephemeral flag
        });
        return;
      }

      // Get the rejection reason from the modal
      const rejectionReason = interaction.fields.getTextInputValue('rejection_reason') || '';

      console.log(`📝 Rejection reason received for application ${applicationId}: "${rejectionReason}"`);

      // Process the rejection with the reason
      await this.processRejection(interaction, applicationId, rejectionReason);
    }
  }

  async processRejection(interaction, applicationId, rejectionReason) {
    try {
      // Import Application model here to avoid circular dependency
      const Application = require('../models/Application');

      // Find the application
      const application = await Application.findById(applicationId);

      if (!application) {
        await interaction.reply({
          content: '❌ Không tìm thấy đơn đăng ký.',
          flags: 64 // Ephemeral flag
        });
        return;
      }

      // Check if application is still pending
      if (application.status !== 'pending') {
        await interaction.reply({
          content: `❌ Đơn đăng ký này đã được ${application.status === 'approved' ? 'duyệt' : 'từ chối'}.`,
          flags: 64 // Ephemeral flag
        });
        return;
      }

      // Get reviewer information
      const reviewer = {
        discordId: interaction.user.id,
        username: interaction.user.username
      };

      // Reject the application with the reason
      await application.reject(reviewer, rejectionReason);

      const statusMessage = rejectionReason
        ? `❌ Đơn đăng ký đã bị từ chối bởi ${reviewer.username}\n📝 Lý do: ${rejectionReason}`
        : `❌ Đơn đăng ký đã bị từ chối bởi ${reviewer.username}`;

      // Update the Discord message to show the new status
      try {
        const discordService = require('./discordService');
        await discordService.updateApplicationMessage(application, interaction.message);
      } catch (updateError) {
        console.error('Failed to update Discord message:', updateError);
      }

      // Respond to the interaction
      await interaction.reply({
        content: statusMessage,
        flags: 64 // Ephemeral flag
      });

      console.log(`✅ Application ${applicationId} rejected by ${reviewer.username} with reason: "${rejectionReason}"`);

    } catch (error) {
      console.error('Error processing rejection:', error);
      await interaction.reply({
        content: '❌ Có lỗi xảy ra khi xử lý việc từ chối đơn đăng ký.',
        flags: 64 // Ephemeral flag
      });
    }
  }

  async checkModeratorPermission(interaction) {
    try {
      // Get the required moderator role ID from environment variables
      const moderatorRoleId = process.env.DISCORD_MODERATOR_ROLE_ID;

      if (!moderatorRoleId) {
        console.warn('⚠️ DISCORD_MODERATOR_ROLE_ID not configured - allowing all users');
        return true; // Allow if not configured (for backward compatibility)
      }

      // Check if the interaction is from a guild (server)
      if (!interaction.guild) {
        console.warn('⚠️ Button interaction not from a guild - denying permission');
        return false;
      }

      // Get the member who clicked the button
      const member = interaction.member;
      if (!member) {
        console.warn('⚠️ Could not get member information - denying permission');
        return false;
      }

      // Check if the member has the required role
      const hasRole = member.roles.cache.has(moderatorRoleId);

      if (hasRole) {
        console.log(`✅ User ${interaction.user.username} has moderator role - permission granted`);
      } else {
        console.log(`❌ User ${interaction.user.username} does not have moderator role - permission denied`);
      }

      return hasRole;

    } catch (error) {
      console.error('Error checking moderator permission:', error);
      return false; // Deny permission on error for security
    }
  }

  destroy() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
      this.isReady = false;
    }
  }
}

// Create singleton instance
const discordBot = new DiscordBot();

module.exports = discordBot;
