const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: ['participation', 'internship', 'achievement', 'training'],
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    pdfPath: { type: String },
    pdfUrl: { type: String },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
