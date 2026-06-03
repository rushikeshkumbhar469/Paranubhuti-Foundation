const express = require('express');
const router = express.Router();
const {
  adminLogin,
  adminMe,
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

// Public route
router.post('/login', adminLogin);

// Protected routes (Admin only)
router.get('/me', protectAdmin, adminMe);
router.get('/requests', protectAdmin, getAdminRequests);
router.patch('/requests/:requestNumber/approve', protectAdmin, approveAdminRequest);
router.patch('/requests/:requestNumber/reject', protectAdmin, rejectAdminRequest);

module.exports = router;
