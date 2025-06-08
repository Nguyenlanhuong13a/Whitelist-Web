# Discord Bot Setup Guide

This guide will help you set up a Discord bot for the Whitelist Web application.

## Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your application a name (e.g., "Whitelist Bot")
4. Click "Create"

## Step 2: Create Bot User

1. In your application, go to the "Bot" section in the left sidebar
2. Click "Add Bot"
3. Confirm by clicking "Yes, do it!"
4. Under "Token", click "Copy" to copy your bot token
5. **Important**: Keep this token secret and never share it publicly

## Step 3: Configure Bot Settings

1. In the Bot section, make sure these settings are configured:
   - **Public Bot**: Can be disabled for security
   - **Requires OAuth2 Code Grant**: Should be disabled
   - **Message Content Intent**: Enable if you want the bot to read message content
   - **Server Members Intent**: Enable if needed
   - **Presence Intent**: Enable if needed

## Step 4: Bot Permissions

Your bot needs the following permissions:
- **Send Messages**: To send application notifications
- **Embed Links**: To send rich embed messages
- **Use Slash Commands**: For potential future slash command features
- **Read Message History**: To update messages
- **Add Reactions**: Optional, for additional interaction features

## Step 5: Generate Invite Link

1. Go to the "OAuth2" section in the left sidebar
2. Click on "URL Generator"
3. Under "Scopes", select:
   - `bot`
   - `applications.commands` (for slash commands)
4. Under "Bot Permissions", select the permissions listed above
5. Copy the generated URL at the bottom
6. Open this URL in a new tab to invite the bot to your server

## Step 6: Get Channel ID

1. In Discord, enable Developer Mode:
   - Go to User Settings (gear icon)
   - Go to "Advanced" under "App Settings"
   - Enable "Developer Mode"
2. Right-click on the channel where you want notifications
3. Click "Copy ID"
4. This is your `DISCORD_WEBHOOK_CHANNEL_ID`

## Step 7: Configure Moderator Role

1. Create or identify the Discord role that should have permission to approve/reject applications
2. Right-click on the role in your server settings
3. Click "Copy ID" to get the role ID
4. This will be your `DISCORD_MODERATOR_ROLE_ID`

## Step 8: Environment Variables

Add these to your `.env` file:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_WEBHOOK_CHANNEL_ID=your_channel_id_here
DISCORD_MODERATOR_ROLE_ID=your_moderator_role_id_here
```

**Important:** Only users with the specified moderator role will be able to approve or reject applications using the Discord buttons.

## Step 9: Test the Bot

1. Run the setup test: `npm run test-setup`
2. Start the server: `npm run dev`
3. Submit a test application through the web form
4. Check if the notification appears in your Discord channel

## Troubleshooting

### Bot Not Responding
- Check if the bot token is correct
- Verify the bot has proper permissions in the channel
- Make sure the bot is online (green status)

### No Notifications Appearing
- Verify the channel ID is correct
- Check if the bot has "Send Messages" permission in that channel
- Look at server console for error messages

### Permission Errors
- Make sure the bot role has sufficient permissions
- Check channel-specific permission overrides
- Verify the bot is above other roles that might restrict permissions

### Button Interactions Not Working
- Ensure the bot has "Use Slash Commands" permission
- Check if the interaction endpoint URL is configured (if using HTTP interactions)
- Verify the bot can edit its own messages

### Permission Denied for Button Interactions
- Verify the user clicking the button has the moderator role specified in `DISCORD_MODERATOR_ROLE_ID`
- Check if the role ID is correct (right-click role → Copy ID)
- Ensure the role is assigned to the users who should have permission
- Check server console logs for permission check details

### Rejection Reason Modal Not Appearing
- Ensure the Discord client supports modals (updated Discord app)
- Check if the bot has proper permissions to show modals
- Verify the interaction is not timing out (Discord has 3-second limit)
- Look for modal-related errors in server console logs

## Security Notes

1. **Never share your bot token** - treat it like a password
2. **Use environment variables** - don't hardcode tokens in your code
3. **Limit bot permissions** - only give permissions that are actually needed
4. **Regenerate token if compromised** - you can regenerate the token in the Developer Portal

## Advanced Configuration

### Rejection Reason Feature
The bot now supports collecting rejection reasons when moderators reject applications:

1. **How it works:**
   - When a moderator clicks "Từ chối" (Reject), a modal appears
   - The modal contains a text input for entering rejection reason
   - Rejection reason is optional but encouraged for transparency
   - The reason is saved to the database and displayed in Discord embed
   - Applicants can see the rejection reason when checking status

2. **Modal Features:**
   - Supports up to 1000 characters
   - Multi-line text input (paragraph style)
   - Vietnamese text and special characters supported
   - Optional field (can be submitted empty)

3. **Where rejection reasons appear:**
   - Updated Discord message embed (in "💬 Phản hồi" field)
   - Web interface status checker (shows as "Phản hồi từ Admin")
   - Database feedback field for record keeping

### Slash Commands (Optional)
If you want to add slash commands for admin functions:

1. Go to "OAuth2" > "URL Generator"
2. Select `applications.commands` scope
3. Use the generated URL to re-invite the bot with command permissions

### Webhook vs Bot Messages
This application uses bot messages (not webhooks) because:
- Interactive buttons require a bot application
- Better control over message editing and deletion
- More reliable for two-way communication

### Rate Limiting
Discord has rate limits for bot messages:
- 5 messages per 5 seconds per channel
- 50 requests per second globally
- The application includes basic rate limiting handling

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test with the `npm run test-setup` command
4. Check Discord's status page for API issues
