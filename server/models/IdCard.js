const mongoose = require('mongoose');

const idCardSchema = new mongoose.Schema(
  {
    idNumber: { type: String, unique: true, required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: [
        'Community Outreach',
        'Medical Volunteer',
        'Education Volunteer',
        'Admin',
        'Event Coordinator',
      ],
      default: 'Community Outreach',
    },
    joinDate: { type: String, required: true },
    bloodGroup: { type: String, default: '' },
    validUntil: { type: String, required: true },
    pdfPath: { type: String },
    pdfUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IdCard', idCardSchema);
