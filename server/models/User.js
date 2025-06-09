const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Steam Authentication (Primary)
  steamId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  steamUsername: {
    type: String,
    required: true,
  },
  steamAvatar: {
    type: String,
    default: null,
  },
  steamProfileUrl: {
    type: String,
    default: null,
  },

  // Discord Authentication (Secondary/Optional)
  discordId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
    index: true,
  },
  discordUsername: {
    type: String,
    default: null,
  },
  discordAvatar: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },

  // User Preferences
  preferences: {
    autoFillSteamId: {
      type: Boolean,
      default: true,
    },
    autoFillDiscordId: {
      type: Boolean,
      default: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

// Index for efficient queries
userSchema.index({ discordId: 1 });
userSchema.index({ createdAt: -1 });

// Instance methods
userSchema.methods.toPublicJSON = function() {
  return {
    discordId: this.discordId,
    discordUsername: this.discordUsername,
    discordAvatar: this.discordAvatar,
    email: this.email,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
    preferences: this.preferences,
  };
};

userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

// Static methods
userSchema.statics.findByDiscordId = function(discordId) {
  return this.findOne({ discordId });
};

userSchema.statics.createFromDiscordData = function(discordData) {
  // Handle modern Discord username format
  let displayUsername;
  if (discordData.global_name) {
    // New username system: use global_name if available
    displayUsername = discordData.global_name;
  } else if (discordData.discriminator && discordData.discriminator !== '0') {
    // Legacy username system: username#discriminator
    displayUsername = `${discordData.username}#${discordData.discriminator}`;
  } else {
    // Modern username system without discriminator
    displayUsername = discordData.username;
  }

  return new this({
    discordId: discordData.id,
    discordUsername: displayUsername,
    discordAvatar: discordData.avatar,
    email: discordData.email,
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
