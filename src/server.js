const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./config/database');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// CORS configuration - Allow mobile app requests
app.use(cors({
  origin: [
    config.clientUrl,
    'http://localhost:3000',
    'http://localhost:8080',
    'http://10.0.2.2:5000', // Android emulator
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Mobile App API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Handle 404 - Not Found
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Server running in ${config.nodeEnv.padEnd(11)} mode                  ║
║   📡 Port: ${String(PORT).padEnd(47)}║
║   🔗 URL: http://localhost:${String(PORT).padEnd(30)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;
