const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, unique: true, required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    amount: { type: Number, required: true, min: 1 },
    date: { type: String, required: true },
    project: {
      type: String,
      enum: [
        'Rural Education Initiative',
        'Healthcare Program',
        'Community Development',
        'Disaster Relief',
        'Environmental Conservation',
      ],
      required: true,
    },
    pan: { type: String, trim: true, default: '' },
    pdfPath: { type: String },
    pdfUrl: { type: String },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Receipt', receiptSchema);
