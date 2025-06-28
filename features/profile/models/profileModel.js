// models/profile.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',

    }],

    name: {
        type: String,
        required: true,
    },



    socialMediaHandle: [
        {
            title: String,
            url: String

        }],
    country: {
        type: String,
        // required: true
    },
    state: {
        type: String,
        // required: true
    },
    city: {
        type: String,
        // required: true
    },
    birthday: {
        type: String,
        // required: true
    },
    profileImage: {
        type: String,

    },
    coverImage: {
        type: String,

    },
    profession: {
        type: String
    },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
