const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // User Information
  discordId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  steamId: {
    type: String,
    required: true,
    trim: true
  },
  characterName: {
    type: String,
    required: true,
    trim: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  backstory: {
    type: String,
    required: true,
    minlength: 100
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  
  // Review Information
  reviewedBy: {
    discordId: String,
    username: String
  },
  feedback: {
    type: String,
    default: ''
  },
  
  // Discord Integration
  discordMessageId: {
    type: String,
    default: null
  },
  discordChannelId: {
    type: String,
    default: null
  },
  
  // Additional Metadata
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
applicationSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for Vietnamese status text
applicationSchema.virtual('statusText').get(function() {
  switch (this.status) {
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Từ chối';
    case 'pending':
    default:
      return 'Đang xem xét';
  }
});

// Index for efficient queries
applicationSchema.index({ discordId: 1, status: 1 });
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ status: 1, submittedAt: -1 });

// Pre-save middleware for validation
applicationSchema.pre('save', function(next) {
  // Validate age
  if (this.age < 16) {
    return next(new Error('Applicant must be at least 16 years old'));
  }
  
  // Set reviewedAt when status changes from pending
  if (this.isModified('status') && this.status !== 'pending' && !this.reviewedAt) {
    this.reviewedAt = new Date();
  }
  
  next();
});

// Static methods
applicationSchema.statics.findByDiscordId = function(discordId) {
  return this.findOne({ discordId }).sort({ submittedAt: -1 });
};

applicationSchema.statics.getPendingApplications = function() {
  return this.find({ status: 'pending' }).sort({ submittedAt: 1 });
};

applicationSchema.statics.getApplicationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
applicationSchema.methods.approve = function(reviewerInfo, feedback = '') {
  this.status = 'approved';
  this.reviewedAt = new Date();
  this.reviewedBy = reviewerInfo;
  this.feedback = feedback;
  return this.save();
};

applicationSchema.methods.reject = function(reviewerInfo, feedback = '') {
  this.status = 'rejected';
  this.reviewedAt = new Date();
  this.reviewedBy = reviewerInfo;
  this.feedback = feedback;
  return this.save();
};

applicationSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  
  // Remove sensitive information
  delete obj.ipAddress;
  delete obj.userAgent;
  delete obj.discordMessageId;
  delete obj.discordChannelId;
  delete obj.__v;
  
  return obj;
};

module.exports = mongoose.model('Application', applicationSchema);
