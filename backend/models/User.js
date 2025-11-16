const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[6-9][0-9]{9}$/;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true, match: [emailRegex, 'Invalid email format'], unique: true },
  mobile: { type: String, required: [true, 'Mobile is required'], match: [mobileRegex, 'Mobile must be 10 digits and start with 6-9'] },
  address: { type: String, required: [true, 'Address is required'] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
