const express = require('express');
const { InteractionType, InteractionResponseType } = require('discord.js');
const Application = require('../models/Application');
const discordService = require('../services/discordService');

const router = express.Router();

// POST /api/discord/interactions - Handle Discord interactions
router.post('/interactions', async (req, res) => {
  try {
    const interaction = req.body;

    // Verify the interaction is from Discord
    if (!interaction || !interaction.type) {
      return res.status(400).json({ error: 'Invalid interaction' });
    }

    // Handle ping interactions (Discord verification)
    if (interaction.type === InteractionType.Ping) {
      return res.json({
        type: InteractionResponseType.Pong
      });
    }

    // Handle button interactions
    if (interaction.type === InteractionType.MessageComponent) {
      return await handleButtonInteraction(interaction, res);
    }

    // Handle other interaction types if needed
    res.status(400).json({ error: 'Unsupported interaction type' });

  } catch (error) {
    console.error('Discord interaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle button interactions (approve/reject)
async function handleButtonInteraction(interaction, res) {
  try {
    const { custom_id, message, member, user } = interaction;
    
    // Extract application ID from custom_id (format: "approve_<applicationId>" or "reject_<applicationId>")
    const [action, applicationId] = custom_id.split('_');
    
    if (!['approve', 'reject'].includes(action) || !applicationId) {
      return res.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Invalid button action',
          flags: 64 // Ephemeral
        }
      });
    }

    // Find the application
    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Application not found',
          flags: 64 // Ephemeral
        }
      });
    }

    // Check if application is still pending
    if (application.status !== 'pending') {
      return res.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `❌ This application has already been ${application.statusText}`,
          flags: 64 // Ephemeral
        }
      });
    }

    // Get reviewer information
    const reviewer = {
      discordId: user?.id || member?.user?.id,
      username: user?.username || member?.user?.username || 'Unknown'
    };

    // Update application status
    let statusMessage;
    if (action === 'approve') {
      await application.approve(reviewer);
      statusMessage = `✅ Application approved by ${reviewer.username}`;
    } else {
      await application.reject(reviewer);
      statusMessage = `❌ Application rejected by ${reviewer.username}`;
    }

    // Update the Discord message to show the new status
    try {
      await discordService.updateApplicationMessage(application, message);
    } catch (updateError) {
      console.error('Failed to update Discord message:', updateError);
    }

    // Respond to the interaction
    res.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: statusMessage,
        flags: 64 // Ephemeral
      }
    });

  } catch (error) {
    console.error('Button interaction error:', error);
    res.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ An error occurred while processing your request',
        flags: 64 // Ephemeral
      }
    });
  }
}

// POST /api/discord/update-status - Manual status update endpoint
router.post('/update-status', async (req, res) => {
  try {
    const { applicationId, status, reviewerId, feedback } = req.body;

    // Validate input
    if (!applicationId || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid parameters',
        message: 'applicationId and valid status are required'
      });
    }

    // Find the application
    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    // Check if application is still pending
    if (application.status !== 'pending') {
      return res.status(409).json({
        error: 'Application already processed',
        message: `Application has already been ${application.statusText}`
      });
    }

    // Update application status
    const reviewer = {
      discordId: reviewerId || 'manual',
      username: 'Manual Update'
    };

    if (status === 'approved') {
      await application.approve(reviewer, feedback);
    } else {
      await application.reject(reviewer, feedback);
    }

    // Update Discord message if it exists
    if (application.discordMessageId) {
      try {
        await discordService.updateApplicationMessageById(application);
      } catch (updateError) {
        console.error('Failed to update Discord message:', updateError);
      }
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application: application.toPublicJSON()
    });

  } catch (error) {
    console.error('Manual status update error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/discord/test - Test Discord connection
router.get('/test', async (req, res) => {
  try {
    const isConnected = discordService.isConnected();

    res.json({
      success: true,
      discord: {
        connected: isConnected,
        botUser: isConnected ? discordService.getBotUser() : null,
        webhookAvailable: !!process.env.DISCORD_WEBHOOK_URL
      }
    });

  } catch (error) {
    console.error('Discord test error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// POST /api/discord/test-message - Send test message
router.post('/test-message', async (req, res) => {
  try {
    const message = await discordService.sendTestMessage();

    res.json({
      success: true,
      message: 'Test message sent successfully',
      messageId: message.id
    });

  } catch (error) {
    console.error('Test message error:', error);
    res.status(500).json({
      error: 'Failed to send test message',
      details: error.message
    });
  }
});

module.exports = router;
