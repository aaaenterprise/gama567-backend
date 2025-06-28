// features/authentication/models/AdminUser.js


const mongoose = require('mongoose');



const ImageSliderModelSchema = new mongoose.Schema({
    file: { type: String, required: true, },


}, { timestamps: true },);




module.exports = mongoose.model('ImageSliderModel', ImageSliderModelSchema);
