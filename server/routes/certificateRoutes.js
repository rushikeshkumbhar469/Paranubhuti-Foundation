const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const validate = require('../middlewares/validate');
const { getAllCertificates, verifyCertificate } = require('../controllers/certificateController');
const {
  submitCertificateRequest,
  submitCertificateEmailRequest,
} = require('../controllers/requestController');

const certValidation = [
  body('type')
    .isIn(['participation', 'internship', 'achievement', 'training'])
    .withMessage('Invalid certificate type'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('title').trim().notEmpty().withMessage('Program/achievement title is required'),
  body('date').notEmpty().withMessage('Date is required'),
];

// POST /api/certificate/generate    → submit certificate request (admin approval required)
router.post(
  '/generate',
  [...certValidation, body('email').isEmail().withMessage('Valid email is required')],
  validate,
  submitCertificateRequest
);

// POST /api/certificate/send-email  → submit certificate email request (admin approval required)
router.post(
  '/send-email',
  [...certValidation, body('email').isEmail().withMessage('Valid email is required')],
  validate,
  submitCertificateEmailRequest
);

// GET  /api/certificate             → list all certificates
router.get('/', getAllCertificates);

// GET  /api/certificate/:certificateNumber → verify certificate
router.get('/:certificateNumber', verifyCertificate);

module.exports = router;
