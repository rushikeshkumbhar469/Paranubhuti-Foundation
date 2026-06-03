const express = require('express');
const router = express.Router();
const {
  createIdRequest,
  createReceiptRequest,
  createReceiptEmailRequest,
  createCertificateRequest,
  createCertificateEmailRequest,
  getRequestStatus,
  downloadPdfFile,
  getDocumentStats,
} = require('../controllers/requestController');

// Submit requests
router.post('/id/generate', createIdRequest);
router.post('/receipt/generate', createReceiptRequest);
router.post('/receipt/send-email', createReceiptEmailRequest);
router.post('/certificate/generate', createCertificateRequest);
router.post('/certificate/send-email', createCertificateEmailRequest);

// Check tracking status and download approved PDF
router.get('/requests/:requestNumber/status', getRequestStatus);
router.get('/requests/:requestNumber/download', downloadPdfFile);

// Stats route
router.get('/documents/stats', getDocumentStats);

module.exports = router;
