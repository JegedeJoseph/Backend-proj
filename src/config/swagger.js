const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campus App API',
      version: '1.0.0',
      description: 'A comprehensive backend API for campus mobile application featuring authentication, past questions, news, wallet, timetable, tasks, and more.',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            studentId: { type: 'string' },
            university: { type: 'string' },
            department: { type: 'string' },
            level: { type: 'string' },
            avatar: { type: 'string' },
            isEmailVerified: { type: 'boolean' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['fullName', 'email', 'studentId', 'password'],
          properties: {
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@university.edu' },
            studentId: { type: 'string', example: 'STU2024001' },
            password: { type: 'string', minLength: 6, example: 'password123' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@university.edu' },
            password: { type: 'string', example: 'password123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
              }
            }
          }
        },
        PastQuestion: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            courseName: { type: 'string' },
            courseCode: { type: 'string' },
            semester: { type: 'string', enum: ['First', 'Second', 'Summer'] },
            level: { type: 'string', enum: ['100', '200', '300', '400', '500', '600', 'Postgraduate'] },
            tags: { type: 'array', items: { type: 'string' } },
            fileUrl: { type: 'string' },
            isPaid: { type: 'boolean' },
            price: { type: 'number' },
            downloads: { type: 'number' },
            rating: { type: 'number' },
            uploadedBy: { type: 'string' }
          }
        },
        NewsArticle: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string', enum: ['events', 'announcements', 'academics', 'sports', 'entertainment', 'general'] },
            imageUrl: { type: 'string' },
            author: { type: 'string' },
            publishedAt: { type: 'string', format: 'date-time' },
            views: { type: 'number' }
          }
        },
        TimetableClass: {
          type: 'object',
          required: ['courseCode', 'courseName', 'startTime', 'endTime'],
          properties: {
            courseCode: { type: 'string', example: 'PHY 101' },
            courseName: { type: 'string', example: 'General Physics' },
            startTime: { type: 'string', example: '08:00 AM' },
            endTime: { type: 'string', example: '10:00 AM' },
            location: { type: 'string', example: 'Hall A' },
            professor: { type: 'string', example: 'Prof. A.S. Okoro' },
            iconName: { type: 'string', example: 'science' },
            accentColor: { type: 'string', example: 'primary' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'cancelled'] },
            category: { type: 'string', enum: ['study', 'assignment', 'exam', 'project', 'personal', 'other'] }
          }
        },
        Wallet: {
          type: 'object',
          properties: {
            balance: { type: 'number' },
            currency: { type: 'string', default: 'NGN' },
            totalEarnings: { type: 'number' },
            totalWithdrawals: { type: 'number' }
          }
        },
        Subscription: {
          type: 'object',
          properties: {
            plan: { type: 'string', enum: ['free', 'basic', 'premium', 'enterprise'] },
            isActive: { type: 'boolean' },
            expiresAt: { type: 'string', format: 'date-time' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            type: { type: 'string', enum: ['info', 'success', 'warning', 'error', 'reminder', 'news', 'promotion'] },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Past Questions', description: 'Past questions management' },
      { name: 'News', description: 'Campus news articles' },
      { name: 'Profile', description: 'User profile management' },
      { name: 'Wallet', description: 'Wallet and transactions' },
      { name: 'Subscription', description: 'Subscription plans' },
      { name: 'Timetable', description: 'Class timetable management' },
      { name: 'Tasks', description: 'Task/planner management' },
      { name: 'Dashboard', description: 'Dashboard and analytics' },
      { name: 'Notifications', description: 'User notifications' }
    ]
  },
  apis: ['./src/docs/*.js'] // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
