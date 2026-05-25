const fs = require('fs');
const DocumentRequest = require('../models/DocumentRequest');
const { generateRequestNumber } = require('../utils/helpers');

const DOC_TYPE_LABELS = {
  'id-card': 'Identity Card',
  receipt: 'Donation Receipt',
  certificate: 'Certificate',
};

/**
 * Create a pending document request (no PDF until admin approves).
 */
async function createDocumentRequest({ docType, deliveryMethod, fullName, email, payload }) {
  const requestNumber = generateRequestNumber();

  const request = await DocumentRequest.create({
    requestNumber,
    docType,
    deliveryMethod: deliveryMethod || 'download',
    fullName,
    email,
    payload,
    status: 'pending',
  });

  return request;
}

const submitRequestResponse = (request, deliveryMethod) => {
  const label = DOC_TYPE_LABELS[request.docType] || 'Document';
  const base = {
    success: true,
    requestNumber: request.requestNumber,
    status: request.status,
    docType: request.docType,
    message:
      deliveryMethod === 'email'
        ? `Your ${label} request has been submitted. You will receive the document by email once an admin approves it.`
        : `Your ${label} request has been submitted and is pending admin approval. Use your Request ID to download once approved.`,
  };
  return base;
};

exports.submitIdRequest = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, role, joinDate, bloodGroup } = req.body;

    const request = await createDocumentRequest({
      docType: 'id-card',
      deliveryMethod: 'download',
      fullName,
      email,
      payload: { fullName, email, phoneNumber, role, joinDate, bloodGroup },
    });

    res.status(201).json(submitRequestResponse(request, 'download'));
  } catch (err) {
    next(err);
  }
};

exports.submitReceiptRequest = async (req, res, next) => {
  try {
    const { fullName, amount, date, project, pan, email } = req.body;

    const request = await createDocumentRequest({
      docType: 'receipt',
      deliveryMethod: 'download',
      fullName,
      email,
      payload: { fullName, amount, date, project, pan, email },
    });

    res.status(201).json(submitRequestResponse(request, 'download'));
  } catch (err) {
    next(err);
  }
};

exports.submitReceiptEmailRequest = async (req, res, next) => {
  try {
    const { fullName, amount, date, project, pan, email } = req.body;

    const request = await createDocumentRequest({
      docType: 'receipt',
      deliveryMethod: 'email',
      fullName,
      email,
      payload: { fullName, amount, date, project, pan, email },
    });

    res.status(201).json(submitRequestResponse(request, 'email'));
  } catch (err) {
    next(err);
  }
};

exports.submitCertificateRequest = async (req, res, next) => {
  try {
    const { type, fullName, title, date, email } = req.body;

    const request = await createDocumentRequest({
      docType: 'certificate',
      deliveryMethod: 'download',
      fullName,
      email,
      payload: { type, fullName, title, date, email },
    });

    res.status(201).json(submitRequestResponse(request, 'download'));
  } catch (err) {
    next(err);
  }
};

exports.submitCertificateEmailRequest = async (req, res, next) => {
  try {
    const { type, fullName, title, date, email } = req.body;

    const request = await createDocumentRequest({
      docType: 'certificate',
      deliveryMethod: 'email',
      fullName,
      email,
      payload: { type, fullName, title, date, email },
    });

    res.status(201).json(submitRequestResponse(request, 'email'));
  } catch (err) {
    next(err);
  }
};

exports.getRequestStatus = async (req, res, next) => {
  try {
    const request = await DocumentRequest.findOne({
      requestNumber: req.params.requestNumber.toUpperCase(),
    }).select('-pdfPath -payload');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    res.json({
      success: true,
      data: {
        requestNumber: request.requestNumber,
        docType: request.docType,
        docTypeLabel: DOC_TYPE_LABELS[request.docType],
        fullName: request.fullName,
        status: request.status,
        deliveryMethod: request.deliveryMethod,
        documentNumber: request.documentNumber,
        rejectionReason: request.rejectionReason,
        createdAt: request.createdAt,
        reviewedAt: request.reviewedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.downloadApprovedDocument = async (req, res, next) => {
  try {
    const request = await DocumentRequest.findOne({
      requestNumber: req.params.requestNumber.toUpperCase(),
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message:
          request.status === 'pending'
            ? 'This request is still pending admin approval.'
            : 'This request was rejected and cannot be downloaded.',
      });
    }

    if (request.deliveryMethod === 'email') {
      return res.status(400).json({
        success: false,
        message: 'This document was sent by email. Check your inbox after approval.',
      });
    }

    if (!request.pdfPath || !fs.existsSync(request.pdfPath)) {
      return res.status(404).json({ success: false, message: 'Document file not found.' });
    }

    const fileName = `${request.docType}-${request.requestNumber}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fs.createReadStream(request.pdfPath).pipe(res);
  } catch (err) {
    next(err);
  }
};
