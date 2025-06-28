// features/authentication/models/user.js


const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin',], default: 'user' },
    wallet: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    verify: { type: Boolean, default: true },
    payment: { type: String, default: '' },
    isMobileVerified: { type: Boolean, default: false },
    lastActive: {
        type: Date,

    },
}, { timestamps: true },);






// Helper method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {

    return this.password == candidatePassword;

};

UserSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model('User', UserSchema);
