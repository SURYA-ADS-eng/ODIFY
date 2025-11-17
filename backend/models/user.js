const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  regNo: String,
  dept: String,
  year: String,
  role: {
    type: String,
    enum: ['Student', 'Faculty', 'HoD', 'Admin'],
    default: 'Student'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
