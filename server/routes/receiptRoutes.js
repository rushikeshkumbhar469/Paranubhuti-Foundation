const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const validate = require('../middlewares/validate');
const { getAllReceipts, verifyReceipt } = require('../controllers/receiptController');
const { submitReceiptRequest, submitReceiptEmailRequest } = require('../controllers/requestController');

const receiptValidation = [
  body('fullName').trim().notEmpty().withMessage('Full legal name is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('date').notEmpty().withMessage('Date is required'),
  body('project')
    .isIn([
      'Rural Education Initiative',
      'Healthcare Program',
      'Community Development',
      'Disaster Relief',
      'Environmental Conservation',
    ])
    .withMessage('Invalid project selection'),
];

// POST /api/receipt/generate     → submit receipt request (admin approval required)
router.post(
  '/generate',
  [...receiptValidation, body('email').isEmail().withMessage('Valid email is required')],
  validate,
  submitReceiptRequest
);

// POST /api/receipt/send-email   → submit receipt email request (admin approval required)
router.post(
  '/send-email',
  [...receiptValidation, body('email').isEmail().withMessage('Valid email is required')],
  validate,
  submitReceiptEmailRequest
);

// GET  /api/receipt              → list all receipts
router.get('/', getAllReceipts);

// GET  /api/receipt/:receiptNumber → verify receipt
router.get('/:receiptNumber', verifyReceipt);

module.exports = router;
