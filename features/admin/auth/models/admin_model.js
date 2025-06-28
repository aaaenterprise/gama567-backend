// features/authentication/models/AdminUser.js


const mongoose = require('mongoose');



const AdminUserSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['sub-admin', 'admin',], default: 'sub-admin' },
    permission: [{ type: String }]
}, { timestamps: true },);






// Helper method to compare passwords
AdminUserSchema.methods.comparePassword = async function (candidatePassword) {

    return this.password == candidatePassword;

};

AdminUserSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
