const Admin = require('../models/Admin');
const Request = require('../models/Request');
const jwt = require('jsonwebtoken');
const { generatePdf } = require('../utils/pdfGenerator');
const { sendEmailWithPdf } = require('../utils/emailSender');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Admin Login
 * @route POST /api/admin/login
 * @access Public
 */
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Logged in successfully',
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin username or password' });
    }
  } catch (error) {
    console.error(`Admin Login Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Get Current Admin Profile
 * @route GET /api/admin/me
 * @access Private (Admin Only)
 */
const adminMe = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin._id,
        username: req.admin.username,
      },
    });
  } catch (error) {
    console.error(`Admin Me Error: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving admin profile' });
  }
};

/**
 * Get List of Document Requests with Counts
 * @route GET /api/admin/requests
 * @access Private (Admin Only)
 */
const getAdminRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Setup filter
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Fetch requests sorted by latest first
    const requests = await Request.find(filter).sort({ createdAt: -1 });

    // Fetch counts for all categories
    const pending = await Request.countDocuments({ status: 'pending' });
    const approved = await Request.countDocuments({ status: 'approved' });
    const rejected = await Request.countDocuments({ status: 'rejected' });
    const total = await Request.countDocuments();

    res.json({
      success: true,
      data: requests,
      counts: {
        pending,
        approved,
        rejected,
        total,
      },
    });
  } catch (error) {
    console.error(`Get Requests Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
};

/**
 * Approve Document Request
 * @route PATCH /api/admin/requests/:requestNumber/approve
 * @access Private (Admin Only)
 */
const approveAdminRequest = async (req, res) => {
  try {
    const { requestNumber } = req.params;

    const request = await Request.findOne({ requestNumber });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status === 'approved') {
      return res.status(400).json({ message: 'Request is already approved' });
    }

    request.status = 'approved';
    request.approvedAt = Date.now();
    await request.save();

    // If deliveryMethod is email, generate and send the PDF immediately
    if (request.deliveryMethod === 'email') {
      try {
        const pdfBuffer = await generatePdf(request);
        const docTypeName = request.docTypeLabel;

        await sendEmailWithPdf({
          to: request.email,
          subject: `Approved: Your Paranubhuti Foundation ${docTypeName}`,
          body: `Congratulations! Your request for the "${docTypeName}" (ID: ${request.requestNumber}) has been reviewed and approved by our team.\n\nPlease find the official PDF attached to this email.\n\nThank you for being a part of Paranubhuti Foundation.`,
          pdfBuffer,
          filename: `${request.docType}_${request.requestNumber}.pdf`,
        });
      } catch (emailErr) {
        console.error(`Failed to send email for approved request ${requestNumber}: ${emailErr.message}`);
        // We still consider the request approved in DB, but notify admin about email failure
        return res.json({
          success: true,
          message: `Request approved, but automated email delivery failed: ${emailErr.message}`,
        });
      }
    }

    res.json({
      success: true,
      message: 'Request approved successfully!',
    });
  } catch (error) {
    console.error(`Approve Request Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during request approval' });
  }
};

/**
 * Reject Document Request
 * @route PATCH /api/admin/requests/:requestNumber/reject
 * @access Private (Admin Only)
 */
const rejectAdminRequest = async (req, res) => {
  try {
    const { requestNumber } = req.params;
    const { reason } = req.body;

    const request = await Request.findOne({ requestNumber });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status === 'approved') {
      return res.status(400).json({ message: 'Cannot reject an already approved request' });
    }

    request.status = 'rejected';
    request.rejectionReason = reason || 'This request was not approved.';
    request.rejectedAt = Date.now();
    await request.save();

    res.json({
      success: true,
      message: 'Request rejected successfully!',
    });
  } catch (error) {
    console.error(`Reject Request Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during request rejection' });
  }
};

module.exports = {
  adminLogin,
  adminMe,
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
};
