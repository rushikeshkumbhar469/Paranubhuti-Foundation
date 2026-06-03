const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    docType: {
      type: String,
      enum: ['id', 'receipt', 'certificate'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    deliveryMethod: {
      type: String,
      enum: ['download', 'email'],
      required: true,
    },
    
    // Submitter / Recipient details
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    
    // ID Card fields
    role: {
      type: String,
      trim: true,
    },
    joinDate: {
      type: Date,
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    
    // Receipt fields
    amount: {
      type: Number,
    },
    date: {
      type: Date,
    },
    project: {
      type: String,
      trim: true,
    },
    pan: {
      type: String,
      trim: true,
    },
    
    // Certificate fields
    title: {
      type: String,
      trim: true,
    },
    certificateType: {
      type: String,
      enum: ['participation', 'internship', 'achievement', 'training'],
    },
    
    // Administrative fields
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for docTypeLabel to display in the frontend
requestSchema.virtual('docTypeLabel').get(function () {
  if (this.docType === 'id') {
    return 'Volunteer ID Card';
  }
  if (this.docType === 'receipt') {
    return 'Donation Receipt';
  }
  if (this.docType === 'certificate') {
    const certType = this.certificateType || 'participation';
    return certType.charAt(0).toUpperCase() + certType.slice(1) + ' Certificate';
  }
  return 'Document Request';
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
