const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const validate = require('../middlewares/validate');
const { getAllIds, verifyId } = require('../controllers/idController');
const { submitIdRequest } = require('../controllers/requestController');

const generateValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
  body('role')
    .isIn(['Community Outreach', 'Medical Volunteer', 'Education Volunteer', 'Admin', 'Event Coordinator'])
    .withMessage('Invalid role'),
  body('joinDate').trim().notEmpty().withMessage('Join date is required'),
];

// POST   /api/id/generate     → submit ID card request (admin approval required)
router.post('/generate', generateValidation, validate, submitIdRequest);

// GET    /api/id               → list all ID records
router.get('/', getAllIds);

// GET    /api/id/:idNumber     → verify specific ID
router.get('/:idNumber', verifyId);

module.exports = router;
