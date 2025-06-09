const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const discordService = require('../services/discordService');

const router = express.Router();

// Validation middleware
const validateApplication = [
  body('discord')
    .notEmpty()
    .withMessage('Discord ID là bắt buộc')
    .isLength({ min: 2, max: 50 })
    .withMessage('Discord ID phải có từ 2-50 ký tự'),
  
  body('steam')
    .notEmpty()
    .withMessage('Steam ID là bắt buộc')
    .isLength({ min: 5, max: 100 })
    .withMessage('Steam ID không hợp lệ'),
  
  body('name')
    .notEmpty()
    .withMessage('Tên nhân vật là bắt buộc')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên nhân vật phải có từ 2-100 ký tự'),
  
  body('birthDate')
    .isISO8601()
    .withMessage('Ngày sinh không hợp lệ')
    .custom((value) => {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 16) {
        throw new Error('Bạn phải từ 16 tuổi trở lên');
      }
      
      return true;
    }),
  
  body('backstory')
    .notEmpty()
    .withMessage('Tiểu sử nhân vật là bắt buộc')
    .isLength({ min: 100, max: 2000 })
    .withMessage('Tiểu sử phải có từ 100-2000 ký tự'),
  
  body('reason')
    .notEmpty()
    .withMessage('Lý do tham gia là bắt buộc')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Lý do phải có từ 10-1000 ký tự')
];

// POST /api/applications - Submit new application
router.post('/', validateApplication, async (req, res) => {
  try {
    // Check database connection first
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau.'
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { discord, steam, name, birthDate, backstory, reason } = req.body;

    // Check if user already has a pending or approved application
    const existingApplication = await Application.findOne({
      discordId: discord,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApplication) {
      return res.status(409).json({
        error: 'Application already exists',
        message: existingApplication.status === 'approved' 
          ? 'Bạn đã được duyệt whitelist'
          : 'Bạn đã có đơn đăng ký đang chờ xem xét'
      });
    }

    // Create new application
    const application = new Application({
      discordId: discord,
      steamId: steam,
      characterName: name,
      birthDate: new Date(birthDate),
      backstory,
      reason,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Save to database
    await application.save();

    // Send Discord notification
    try {
      const discordMessage = await discordService.sendApplicationNotification(application);
      
      // Update application with Discord message info
      if (discordMessage) {
        application.discordMessageId = discordMessage.id;
        application.discordChannelId = discordMessage.channel.id;
        await application.save();
      }
    } catch (discordError) {
      console.error('Discord notification failed:', discordError);
      // Don't fail the application submission if Discord fails
    }

    res.status(201).json({
      success: true,
      message: 'Đơn đăng ký đã được gửi thành công',
      application: application.toPublicJSON()
    });

  } catch (error) {
    console.error('Application submission error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({
        error: 'Database connection error',
        message: 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau.'
      });
    }

    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Có lỗi xảy ra khi gửi đơn đăng ký'
    });
  }
});

// GET /api/applications/status/steam/:steamId - Check application status by Steam ID
router.get('/status/steam/:steamId', async (req, res) => {
  try {
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau.'
      });
    }

    const { steamId } = req.params;

    if (!steamId) {
      return res.status(400).json({
        error: 'Steam ID is required'
      });
    }

    const application = await Application.findOne({ steamId });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'Không tìm thấy đơn đăng ký với Steam ID này'
      });
    }

    res.json({
      success: true,
      application: application.toPublicJSON()
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái'
    });
  }
});

// GET /api/applications/status/:discordId - Check application status by Discord ID (legacy)
router.get('/status/:discordId', async (req, res) => {
  try {
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau.'
      });
    }

    const { discordId } = req.params;

    if (!discordId) {
      return res.status(400).json({
        error: 'Discord ID is required'
      });
    }

    const application = await Application.findByDiscordId(discordId);

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'Không tìm thấy đơn đăng ký với Discord ID này'
      });
    }

    res.json({
      success: true,
      application: application.toPublicJSON()
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái'
    });
  }
});

// GET /api/applications/history/:identifier - Get application history by Discord ID or Steam ID
router.get('/history/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    if (!identifier) {
      return res.status(400).json({
        error: 'Identifier is required',
        message: 'Discord ID hoặc Steam ID là bắt buộc'
      });
    }

    // Build query - search by either Discord ID or Steam ID
    let query = {
      $or: [
        { discordId: identifier },
        { steamId: identifier }
      ]
    };

    // Add status filter if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get applications with pagination
    const applications = await Application.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalApplications = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalApplications / limitNum);

    if (applications.length === 0) {
      return res.status(404).json({
        error: 'No applications found',
        message: 'Không tìm thấy đơn đăng ký nào với thông tin này'
      });
    }

    // Format applications for response
    const formattedApplications = applications.map(app => ({
      ...app.toPublicJSON(),
      // Add additional fields for history view
      submissionDate: app.submittedAt,
      reviewDate: app.reviewedAt,
      moderator: app.reviewedBy ? {
        username: app.reviewedBy.username,
        discordId: app.reviewedBy.discordId
      } : null
    }));

    res.json({
      success: true,
      applications: formattedApplications,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalApplications,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: limitNum
      },
      summary: {
        total: totalApplications,
        pending: applications.filter(app => app.status === 'pending').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      }
    });
  } catch (error) {
    console.error('Error fetching application history:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Có lỗi xảy ra khi tải lịch sử đơn đăng ký'
    });
  }
});

// GET /api/applications/stats - Get application statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Application.getApplicationStats();
    const total = await Application.countDocuments();

    const formattedStats = {
      total,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      stats: formattedStats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/applications - Get all applications (admin only, with pagination)
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        message: 'Cơ sở dữ liệu chưa được kết nối. Vui lòng thử lại sau.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const query = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications: applications.map(app => app.toPublicJSON()),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Applications list error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;
