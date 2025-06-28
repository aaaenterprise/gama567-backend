const mongoose = require('mongoose');

const withdrawPointSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String, enum: ['Pending', 'Approved', 'Rejected'], default: "Pending",
        required: true

    },
    paymentMethod: {
        type: String,
        required: true
    },
    upiNumber: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const WithdrawPoint = mongoose.model('WithdrawPoint', withdrawPointSchema);

module.exports = WithdrawPoint;
