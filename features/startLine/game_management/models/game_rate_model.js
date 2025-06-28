const mongoose = require('mongoose');
const gameRateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminUser',
        required: true,
        unique: true,
    },
    singleDigit: {
        type: Number,
        required: true,

    },

    singlePana: {
        type: Number,
        required: true,

    },
    doublePana: {
        type: Number,
        required: true,

    },
    triplePana: {
        type: Number,
        required: true,

    },



});

const GameRate = mongoose.model('GameRateStar', gameRateSchema);

module.exports = GameRate;
