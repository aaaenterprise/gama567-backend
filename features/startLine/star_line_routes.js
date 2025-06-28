
const express = require('express')
const app = express()


const adminAuthMiddleware = require('../admin/validator')
const GameManagementRoutes = require('./game_management/routes/game_management_route')
const WinningHistoryRoutes = require('./winning_history/routes/winning_history_routes')
const DeclareResultRoutes = require('./declare_result/routes/declare_result_routes')

// index page
app.use('/game', adminAuthMiddleware(), GameManagementRoutes);
app.use('/win', adminAuthMiddleware(), WinningHistoryRoutes);
app.use('/result', adminAuthMiddleware(), DeclareResultRoutes);


module.exports = app;

