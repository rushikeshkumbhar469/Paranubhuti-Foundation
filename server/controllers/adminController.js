const jwt = require('jsonwebtoken');
const DocumentRequest = require('../models/DocumentRequest');
const { fulfillDocumentRequest } = require('../utils/documentFulfillment');

const DOC_TYPE_LABELS = {
  'id-card': 'Identity Card',
  receipt: 'Donation Receipt',
  certificate: 'Certificate',
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const secret = process.env.JWT_SECRET || 'paranubhuti-admin-secret';

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ username, role: 'admin' }, secret, { expiresIn: '8h' });

    res.json({
      success: true,
      token,
      admin: { username },
      message: 'Login successful.',
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, admin: { username: req.admin.username } });
};

exports.getRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const requests = await DocumentRequest.find(filter)
      .sort({ createdAt: -1 })
      .select('-pdfPath -payload')
      .lean();

    const data = requests.map((r) => ({
      ...r,
      docTypeLabel: DOC_TYPE_LABELS[r.docType] || r.docType,
    }));

    const counts = {
      pending: await DocumentRequest.countDocuments({ status: 'pending' }),
      approved: await DocumentRequest.countDocuments({ status: 'approved' }),
      rejected: await DocumentRequest.countDocuments({ status: 'rejected' }),
      total: await DocumentRequest.countDocuments(),
    };

    res.json({ success: true, count: data.length, counts, data });
  } catch (err) {
    next(err);
  }
};

exports.approveRequest = async (req, res, next) => {
  try {
    const request = await DocumentRequest.findOne({
      requestNumber: req.params.requestNumber.toUpperCase(),
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}.`,
      });
    }

    const result = await fulfillDocumentRequest(request);

    request.status = 'approved';
    request.documentNumber = result.documentNumber;
    request.pdfPath = result.pdfPath;
    request.pdfUrl = result.pdfUrl;
    request.reviewedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: `Request ${request.requestNumber} approved. ${
        request.deliveryMethod === 'email'
          ? 'Document emailed to the user.'
          : 'User can now download the document.'
      }`,
      data: {
        requestNumber: request.requestNumber,
        status: request.status,
        documentNumber: request.documentNumber,
        deliveryMethod: request.deliveryMethod,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const request = await DocumentRequest.findOne({
      requestNumber: req.params.requestNumber.toUpperCase(),
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}.`,
      });
    }

    request.status = 'rejected';
    request.rejectionReason = reason || 'Request did not meet approval criteria.';
    request.reviewedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: `Request ${request.requestNumber} rejected.`,
      data: { requestNumber: request.requestNumber, status: request.status },
    });
  } catch (err) {
    next(err);
  }
};
