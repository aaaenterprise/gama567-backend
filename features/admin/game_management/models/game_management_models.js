const mongoose = require('mongoose');

const specialScheduleSchema = new mongoose.Schema({
    dayOfWeek: {
        type: String,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    },
    openingTime: {
        type: String,
    },
    closingTime: {
        type: String,
    },
});

const gameScheduleSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: true,
        unique: true
    },
    openingTime: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    closingTime: {
        type: String,
        required: true,
    },
    hasSpecialTime: {
        type: Boolean,
        default: false,
    },
    todayResultDeclared: {
        type: Boolean,
        default: false,
    },
    specialSchedule: [specialScheduleSchema],
    timestamp: {
        type: Date,
        // required:true,
        default: Date.now,
    },
});

const GameManagement = mongoose.model('GameManagement', gameScheduleSchema);

module.exports = GameManagement;
