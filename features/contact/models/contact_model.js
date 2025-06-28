const mongoose = require('mongoose');

// Define the schema for the data
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  about: {
    type: String,
    require: true
  },

  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: false,

  },
  dateOfBirth: {
    type: Date,
    require: true
  },
  tag: [{ type: String }],
  profileImage: {
    type: String,
    // require: true
  },
  mobileNumbers: [
    {
      title: String,
      number: Number
    }
  ],
  emailId: [
    {
      title: String,
      email: String
    }
  ],
  socialMedia: [
    {
      title: String,
      url: String
    }
  ],
  notes: [
    {
      title: String,
      content: String,
      createdAt: String
    }
  ],
  createdAt:{
type:Date,
default:Date.now
  }
});

// Create the MongoDB model
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
