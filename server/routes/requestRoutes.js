const express = require('express');
const router = express.Router();
const { getRequestStatus, downloadApprovedDocument } = require('../controllers/requestController');

router.get('/:requestNumber/status', getRequestStatus);
router.get('/:requestNumber/download', downloadApprovedDocument);

module.exports = router;
