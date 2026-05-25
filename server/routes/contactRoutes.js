const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const validate = require('../middlewares/validate');
const { submitContact, getAllContacts, updateStatus } = require('../controllers/contactController');

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

// POST  /api/contact              → submit support message
router.post('/', contactValidation, validate, submitContact);

// GET   /api/contact              → list all contact submissions
router.get('/', getAllContacts);

// PATCH /api/contact/:id/status   → update contact status
router.patch('/:id/status', body('status').notEmpty().withMessage('Status is required'), validate, updateStatus);

module.exports = router;
