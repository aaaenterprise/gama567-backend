
const express = require('express')
const app = express()

const loginAdminRoute = require('./auth/routes/admin_auth_routes')
const GameManagementRoutes = require('./game_management/routes/game_management_route')
const UserManagementRoutes = require('./user_management/routes/user_management_routes')
const dashboardAdminRoute = require('./dashboard/routes/dashboard_routes')
const SettingsRoutes = require('./settings/routes/setting_route')
const DeclareResultRoutes = require('./declare_result/routes/declare_result_routes')
const BettingHistoryController = require('../betting_history/controllers/betting_history_controller')
const WinningHistoryRoutes = require('./winning_history/routes/winning_history_routes')

const WithdrawPointRoutes = require('../withdraw_points/routes/withdraw_point_route')
const WalletTransectionController = require('../wallet_management/controllers/wallet_transection_controller')
const adminAuthMiddleware = require('./validator')
const ImageRoutes=require('./image_slider/routes/image_slider_route')
const StarLineRoutes=require('../startLine/star_line_routes')
const StarBettingHistoryController=require('../startLine/betting_history/controllers/betting_history_controller')
// router.post('/register', validateRegistration, authController.registerUser);
// index page
app.use('/auth', loginAdminRoute);

app.use('/image', adminAuthMiddleware(), ImageRoutes);
app.use('/game', adminAuthMiddleware(), GameManagementRoutes);
app.use('/user', adminAuthMiddleware(), UserManagementRoutes);
app.use('/setting', adminAuthMiddleware(), SettingsRoutes);
app.use('/result', adminAuthMiddleware(), DeclareResultRoutes);
app.use('/withdraw', adminAuthMiddleware(), WithdrawPointRoutes);
app.use('/win', adminAuthMiddleware(), WinningHistoryRoutes);
app.post('/bet', adminAuthMiddleware(), BettingHistoryController.getAllBettingHistory);
app.put('/bet', adminAuthMiddleware(), BettingHistoryController.updateBettingHistory);
app.get('/bet/:userId', adminAuthMiddleware(), BettingHistoryController.getBettingHistoryByUserId);
app.delete('/bet/:id', adminAuthMiddleware(), BettingHistoryController.deleteBettingHistoryById);
app.post('/point/add/:id', adminAuthMiddleware(), WalletTransectionController.addMoney);
app.post('/point/withdraw/:id', adminAuthMiddleware(), WalletTransectionController.withdrawMoney);
app.get('/transaction/:id', adminAuthMiddleware(), WalletTransectionController.getUserTransectionById);
app.get('/transaction/', adminAuthMiddleware(), WalletTransectionController.getTransactionsByTimestampAndDescription);

app.post('/starline/bet', adminAuthMiddleware(), StarBettingHistoryController.getAllBettingHistory);
app.put('/starline/bet', adminAuthMiddleware(), StarBettingHistoryController.updateBettingHistory);

app.use('/starline', StarLineRoutes);
// router.post('/login', AdminAuthController.loginAdmin);
module.exports = app;

