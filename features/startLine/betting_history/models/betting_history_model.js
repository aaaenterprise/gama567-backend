const mongoose = require('mongoose');

const bettingHistorySchema = new mongoose.Schema({
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
    betAmount: {
        type: Number,
        required: true,
    },
    betNumber: {
        type: String,
        required: true,
    },

    timestamp: {
        type: Date,
        required: true
    },
});

const BettingHistory = mongoose.model('BettingHistoryStar', bettingHistorySchema);

module.exports = BettingHistory;
