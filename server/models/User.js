const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // enforce unique email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'merchant', 'delivery'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
