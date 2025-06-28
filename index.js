// server.js - Main application entry point
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const dotenv = require('dotenv');
const cron = require('node-cron');

const compression = require('compression');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Set timezone
process.env.TZ = 'Asia/Kolkata';

// Determine the number of CPU cores to use (leave 1 core for OS operations if possible)
const numCPUs = Math.max(1, os.cpus().length - 1);

// Import utilities
const { httpStatusCodes } = require('./common/utils');

// Function to setup and start the Express application
async function setupExpressApp() {
    const app = express();
    
    // Security middleware
    app.use(helmet());
    
    // Compression middleware to reduce response size
    app.use(compression());
    
    // CORS configuration
    const corsOptions = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
    };
    app.use(cors(corsOptions));
    
    // Request parsing middleware with increased limits for large requests
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    
    // Serve static files with caching headers
    app.use(express.static(path.join(__dirname, 'public'), {
        maxAge: '1d', // Cache static files for 1 day
    }));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
        maxAge: '1d',
    }));
    
    
    
    
    // Connect to MongoDB with optimized settings
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            // MongoDB driver will maintain up to 10 socket connections
            maxPoolSize: 10,
            // Set timeout for operations
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
    
    
    // Middleware for response time tracking (development only)
    if (process.env.NODE_ENV !== 'production') {
        app.use((req, res, next) => {
            const start = Date.now();
            res.on('finish', () => {
                const duration = Date.now() - start;
                console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
            });
            next();
        });
    }
    
    // Load route modules
    const authRoutes = require('./features/authentication/routes/authRoutes');
    const walletTransactionRoutes = require('./features/wallet_management/routes/wallet_transection_route');
    const BettingHistoryRoutes = require('./features/betting_history/routes/betting_history_route');
    const gameScheduleController = require('./features/admin/game_management/controllers/game_management_controller');
  const DeclareResultController = require('./features/admin/declare_result/controllers/declare_result_controller');
    const profileRoutes = require('./features/profile/routes/profileRoutes');
    const SettingRoutes = require('./features/admin/settings/routes/setting_route');
    const WinningHistoryController = require('./features/admin/winning_history/controller/winning_history_controller');
    const WithdrawPointRoutes = require('./features/withdraw_points/routes/withdraw_point_route');

    const ImageSliderController = require('./features/admin/image_slider/controllers/image_slider_controller');

    const adminRoutes = require('./features/admin/admin_routes');
    
    // Auth middleware
    const authMiddleware = require('./features/authentication/middleware/authMiddleware');
    
    // Configure routes
    app.use('/api/auth', authRoutes);
    app.use('/api/transaction', authMiddleware(), walletTransactionRoutes);
    app.use('/api/bet', authMiddleware(), BettingHistoryRoutes);
    app.use('/api/setting', SettingRoutes);
    app.use('/api/withdraw', WithdrawPointRoutes);
    app.get('/api/winning/:userId', authMiddleware(), WinningHistoryController.getWinningHistoryByUserId);
    app.use('/api/profile', profileRoutes);
    app.get('/api/game/', authMiddleware(), gameScheduleController.getAllGameManagements);
    app.get('/api/game/rate/', authMiddleware(), gameScheduleController.getGameRate);
    app.get('/api/game/:gameName', authMiddleware(), gameScheduleController.getGameManagementByName);
    // app.use('/api/starline/bet', authMiddleware(), StarLineBettingHistoryRoutes);
    // app.get('/api/starline/game/rate/', authMiddleware(), StarLineGameController.getGameRate);
    // app.get('/api/starline/game/', authMiddleware(), StarLineGameController.getAllGameManagements);
    app.get('/api/result/:gameName', authMiddleware(), DeclareResultController.getDeclaredResultByGameName);
    // app.get('/api/starline/result/:gameName', authMiddleware(), StarLineDeclareResultController.getDeclaredResultByGameName);
    // app.get('/api/starline/winning/:userId', authMiddleware(), StarLineWinningHistoryController.getWinningHistoryByUserId);
    app.get('/api/image/', authMiddleware(), ImageSliderController.getAllImage);
    app.use('/api/admin', adminRoutes);
    
    // // UPI payment result endpoint
    // app.get('/api/upi-payment-result', (req, res) => {
    //     const { status, transactionId, amount } = req.query;
    //     console.log(req.query);
        
    //     if (status === 'success') {
    //         res.send('Payment Successful!');
    //     } else if (status === 'failure') {
    //         res.send('Payment Failed!');
    //     } else {
    //         res.send('Payment Cancelled!');
    //     }
    // });
    
    // Error handling middleware
    app.use((error, req, res, next) => {
        console.error('Error:', error.message);
        
        if (process.env.NODE_ENV === 'development') {
            console.error('Stack:', error.stack);
        }
        
        if (error.isJoi) {
            res.status(httpStatusCodes.unprocessableEntity);
        } else {
            res.status(httpStatusCodes.internalServerError);
        }
        
        res.json({ success: false, message: error.message, data: {} });
    });
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
    });
    
    // Schedule cron jobs on only one worker
    if (cluster.isPrimary || (cluster.isWorker && cluster.worker.id === 1)) {
        setupCronJobs();
    }
}

// Function to set up scheduled tasks
function setupCronJobs() {
    const GameManagementServices = require("./features/admin/game_management/services/game_management_services");
    const DeclareResultService = require('./features/admin/declare_result/services/declare_result_service');
    const WinningHistoryService = require('./features/admin/winning_history/services/winning_history_service');
    const BettingHistoryService = require('./features/betting_history/services/betting_history_services');
    const WalletManagementService = require('./features/wallet_management/services/wallet_transection_service');
    const WithdrawPointsService = require('./features/withdraw_points/services/withdraw_point_service');
    
    // Daily cleanup at 2 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('Running scheduled cleanup tasks...');
        try {
            await Promise.all([
                deleteOldData(), // This function needs to be defined somewhere
                GameManagementServices.resetGameModel(),
                DeclareResultService.deleteOldDeclareResultHistory(),
                WinningHistoryService.deleteOldWinningHistory(),
                BettingHistoryService.deleteOldBiddingHistory(),
                WalletManagementService.deleteOldWalletHistory(),
                WithdrawPointsService.deleteOldTransactionHistory()
            ]);
            console.log('Scheduled cleanup completed successfully');
        } catch (error) {
            console.error('Error in scheduled cleanup:', error);
        }
    });
}

// Main application entry point
if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running`);
    console.log(`Setting up ${numCPUs} workers...`);
    
    // Fork workers based on CPU count
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    // Handle worker exit and restart workers
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        console.log('Starting a new worker...');
        cluster.fork();
    });
} else {
    // Worker processes run the Express app
    setupExpressApp().catch(err => {
        console.error('Failed to start worker:', err);
        process.exit(1);
    });
}