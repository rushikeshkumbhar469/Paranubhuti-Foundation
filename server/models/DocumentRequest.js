const mongoose = require('mongoose');

const documentRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, unique: true, required: true },
    docType: {
      type: String,
      enum: ['id-card', 'receipt', 'certificate'],
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ['download', 'email'],
      default: 'download',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    documentNumber: { type: String },
    pdfPath: { type: String },
    pdfUrl: { type: String },
    rejectionReason: { type: String, default: '' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DocumentRequest', documentRequestSchema);
