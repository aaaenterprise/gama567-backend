const mongoose = require('mongoose');

const winningHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    gameName: {
        type: String,
        required: true,
    },
    betType: {
        type: String, // 'singleDigit', 'jodiDigit', 'singlePana', etc.
        required: true,
    },
    betTime: {
        type: String,
       
    },
    betAmount: {
        type: Number,
        required: true,
    },
    winningAmount: {
        type: Number,
        required: true,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const WinningHistory = mongoose.model('WinningHistory', winningHistorySchema);

module.exports = WinningHistory;
