const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  discordUsername: {
    type: String,
    required: true,
  },
  discordAvatar: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
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
  return new this({
    discordId: discordData.id,
    discordUsername: `${discordData.username}#${discordData.discriminator}`,
    discordAvatar: discordData.avatar,
    email: discordData.email,
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
