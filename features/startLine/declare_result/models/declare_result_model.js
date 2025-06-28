const mongoose = require('mongoose');

const declareResultSchema = new mongoose.Schema({
    winners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WinningHistoryStar', // Reference to the User model
        required: true,
    }],
    gameName: {
        type: String,
        required: true,
    },

    openPana: {
        type: String,
        // required: true,
    },


    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const DeclareResult = mongoose.model('DeclareResultStar', declareResultSchema);

module.exports = DeclareResult;
