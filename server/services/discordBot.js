const { Client, GatewayIntentBits, Events } = require('discord.js');

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

    // Handle button interactions
    this.client.on(Events.InteractionCreate, async (interaction) => {
      try {
        if (!interaction.isButton()) return;

        console.log(`🔘 Button interaction received: ${interaction.customId}`);
        await this.handleButtonInteraction(interaction);
      } catch (error) {
        console.error('Error handling button interaction:', error);

        // Try to respond with error message if possible
        try {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: '❌ Có lỗi xảy ra khi xử lý yêu cầu của bạn.',
              ephemeral: true
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
        ephemeral: true
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
          ephemeral: true
        });
        return;
      }

      // Check if application is still pending
      if (application.status !== 'pending') {
        await interaction.reply({
          content: `❌ Đơn đăng ký này đã được ${application.status === 'approved' ? 'duyệt' : 'từ chối'}.`,
          ephemeral: true
        });
        return;
      }

      // Get reviewer information
      const reviewer = {
        discordId: interaction.user.id,
        username: interaction.user.username
      };

      // Update application status
      let statusMessage;
      if (action === 'approve') {
        await application.approve(reviewer);
        statusMessage = `✅ Đơn đăng ký đã được duyệt bởi ${reviewer.username}`;
      } else {
        await application.reject(reviewer);
        statusMessage = `❌ Đơn đăng ký đã bị từ chối bởi ${reviewer.username}`;
      }

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
        ephemeral: true
      });

      console.log(`✅ Application ${applicationId} ${action}ed by ${reviewer.username}`);

    } catch (error) {
      console.error('Button interaction error:', error);
      await interaction.reply({
        content: '❌ Có lỗi xảy ra khi xử lý yêu cầu của bạn.',
        ephemeral: true
      });
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
