const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const validate = require('../middlewares/validate');
const authAdmin = require('../middlewares/authAdmin');
const {
  login,
  me,
  getRequests,
  approveRequest,
  rejectRequest,
} = require('../controllers/adminController');

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', authAdmin, me);
router.get('/requests', authAdmin, getRequests);
router.patch('/requests/:requestNumber/approve', authAdmin, approveRequest);
router.patch(
  '/requests/:requestNumber/reject',
  authAdmin,
  [body('reason').optional().trim()],
  validate,
  rejectRequest
);

module.exports = router;
