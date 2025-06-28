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

const GameManagement = mongoose.model('GameManagementStar', gameScheduleSchema);

module.exports = GameManagement;
