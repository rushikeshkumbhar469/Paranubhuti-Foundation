const Request = require('../models/Request');
const { generatePdf } = require('../utils/pdfGenerator');

// Helper to generate a unique Request ID
// Format: PF[2 random letters]-[4 random digits]-[4 random digits]
const generateUniqueRequestId = async () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let unique = false;
  let requestNumber = '';

  while (!unique) {
    const char1 = letters[Math.floor(Math.random() * 26)];
    const char2 = letters[Math.floor(Math.random() * 26)];
    const block1 = Math.floor(1000 + Math.random() * 9000); // 4 random digits
    const block2 = Math.floor(1000 + Math.random() * 9000); // 4 random digits
    requestNumber = `PF${char1}${char2}-${block1}-${block2}`;

    // Verify uniqueness
    const exists = await Request.findOne({ requestNumber });
    if (!exists) {
      unique = true;
    }
  }
  return requestNumber;
};

/**
 * Submit Volunteer ID Request
 * @route POST /api/id/generate
 * @access Public
 */
const createIdRequest = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, role, joinDate, bloodGroup } = req.body;

    if (!fullName || !email || !phoneNumber || !joinDate) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const requestNumber = await generateUniqueRequestId();

    const newRequest = await Request.create({
      requestNumber,
      docType: 'id',
      deliveryMethod: 'download',
      fullName,
      email,
      phoneNumber,
      role: role || 'Community Outreach',
      joinDate: new Date(joinDate),
      bloodGroup: bloodGroup || 'O+',
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully!',
      requestNumber,
      data: newRequest,
    });
  } catch (error) {
    console.error(`Create ID Request Error: ${error.message}`);
    res.status(500).json({ message: 'Server error submitting ID request' });
  }
};

/**
 * Submit Donation Receipt Request (Download delivery)
 * @route POST /api/receipt/generate
 * @access Public
 */
const createReceiptRequest = async (req, res) => {
  try {
    const { fullName, amount, date, project, pan, email } = req.body;

    if (!fullName || !amount || !date || !email) {
      return res.status(400).json({ message: 'Please fill in Name, Amount, Date and Email' });
    }

    const requestNumber = await generateUniqueRequestId();

    const newRequest = await Request.create({
      requestNumber,
      docType: 'receipt',
      deliveryMethod: 'download',
      fullName,
      email,
      amount: Number(amount),
      date: new Date(date),
      project: project || 'General Fund',
      pan: pan || '',
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully!',
      requestNumber,
      data: newRequest,
    });
  } catch (error) {
    console.error(`Create Receipt Request Error: ${error.message}`);
    res.status(500).json({ message: 'Server error submitting Receipt request' });
  }
};

/**
 * Submit Donation Receipt Request (Email delivery)
 * @route POST /api/receipt/send-email
 * @access Public
 */
const createReceiptEmailRequest = async (req, res) => {
  try {
    const { fullName, amount, date, project, pan, email } = req.body;

    if (!fullName || !amount || !date || !email) {
      return res.status(400).json({ message: 'Please fill in Name, Amount, Date and Email' });
    }

    const requestNumber = await generateUniqueRequestId();

    const newRequest = await Request.create({
      requestNumber,
      docType: 'receipt',
      deliveryMethod: 'email',
      fullName,
      email,
      amount: Number(amount),
      date: new Date(date),
      project: project || 'General Fund',
      pan: pan || '',
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully! It will be emailed upon approval.',
      requestNumber,
      data: newRequest,
    });
  } catch (error) {
    console.error(`Create Receipt Email Request Error: ${error.message}`);
    res.status(500).json({ message: 'Server error submitting Receipt email request' });
  }
};

/**
 * Submit Certificate Request (Download delivery)
 * @route POST /api/certificate/generate
 * @access Public
 */
const createCertificateRequest = async (req, res) => {
  try {
    const { fullName, title, date, email, type } = req.body;

    if (!fullName || !title || !date || !email) {
      return res.status(400).json({ message: 'Please fill in Name, Title, and Date' });
    }

    const requestNumber = await generateUniqueRequestId();

    const newRequest = await Request.create({
      requestNumber,
      docType: 'certificate',
      deliveryMethod: 'download',
      fullName,
      email,
      title,
      date: new Date(date),
      certificateType: type || 'participation',
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully!',
      requestNumber,
      data: newRequest,
    });
  } catch (error) {
    console.error(`Create Certificate Request Error: ${error.message}`);
    res.status(500).json({ message: 'Server error submitting Certificate request' });
  }
};

/**
 * Submit Certificate Request (Email delivery)
 * @route POST /api/certificate/send-email
 * @access Public
 */
const createCertificateEmailRequest = async (req, res) => {
  try {
    const { fullName, title, date, email, type } = req.body;

    if (!fullName || !title || !date || !email) {
      return res.status(400).json({ message: 'Please fill in Name, Title, and Date' });
    }

    const requestNumber = await generateUniqueRequestId();

    const newRequest = await Request.create({
      requestNumber,
      docType: 'certificate',
      deliveryMethod: 'email',
      fullName,
      email,
      title,
      date: new Date(date),
      certificateType: type || 'participation',
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully! It will be emailed upon approval.',
      requestNumber,
      data: newRequest,
    });
  } catch (error) {
    console.error(`Create Certificate Email Request Error: ${error.message}`);
    res.status(500).json({ message: 'Server error submitting Certificate email request' });
  }
};

/**
 * Get Request Status By Request ID
 * @route GET /api/requests/:requestNumber/status
 * @access Public
 */
const getRequestStatus = async (req, res) => {
  try {
    const { requestNumber } = req.params;

    // Search case-insensitively or trim whitespaces
    const request = await Request.findOne({ 
      requestNumber: { $regex: new RegExp('^' + requestNumber.trim() + '$', 'i') } 
    });

    if (!request) {
      return res.status(404).json({ message: 'Could not find that request.' });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error(`Get Status Error: ${error.message}`);
    res.status(500).json({ message: 'Server error searching for request' });
  }
};

/**
 * Download Approved Request PDF
 * @route GET /api/requests/:requestNumber/download
 * @access Public
 */
const downloadPdfFile = async (req, res) => {
  try {
    const { requestNumber } = req.params;

    const request = await Request.findOne({
      requestNumber: { $regex: new RegExp('^' + requestNumber.trim() + '$', 'i') }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ message: 'This document has not been approved by the admin yet' });
    }

    // Generate PDF buffer
    const pdfBuffer = await generatePdf(request);

    // Set Response Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="document-${request.requestNumber}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error(`Download PDF Error: ${error.message}`);
    res.status(500).json({ message: 'Server error generating document' });
  }
};

/**
 * Get Document Statistics
 * @route GET /api/documents/stats
 * @access Public
 */
const getDocumentStats = async (req, res) => {
  try {
    const certificatesCount = await Request.countDocuments({ docType: 'certificate', status: 'approved' });
    const activeVolunteersCount = await Request.countDocuments({ docType: 'id', status: 'approved' });
    
    const donationsSum = await Request.aggregate([
      { $match: { docType: 'receipt', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDonationsAmount = donationsSum.length > 0 ? donationsSum[0].total : 0;
    
    // Formatting donation stats beautifully (e.g. ₹5,000 or using Indian scale lakh/crore if needed)
    res.json({
      success: true,
      certificates: certificatesCount,
      totalDonations: totalDonationsAmount,
      volunteers: activeVolunteersCount
    });
  } catch (error) {
    console.error(`Get Document Stats Error: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving stats' });
  }
};

module.exports = {
  createIdRequest,
  createReceiptRequest,
  createReceiptEmailRequest,
  createCertificateRequest,
  createCertificateEmailRequest,
  getRequestStatus,
  downloadPdfFile,
  getDocumentStats,
};
