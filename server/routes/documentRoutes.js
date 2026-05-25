const express = require('express');
const router = express.Router();
const IdCard = require('../models/IdCard');
const Receipt = require('../models/Receipt');
const Certificate = require('../models/Certificate');

/**
 * GET /api/documents
 * Unified document history – returns all generated documents across types.
 */
router.get('/', async (_req, res, next) => {
  try {
    const [ids, receipts, certificates] = await Promise.all([
      IdCard.find().sort({ createdAt: -1 }).select('-pdfPath').lean(),
      Receipt.find().sort({ createdAt: -1 }).select('-pdfPath').lean(),
      Certificate.find().sort({ createdAt: -1 }).select('-pdfPath').lean(),
    ]);

    const combined = [
      ...ids.map((d) => ({ ...d, docType: 'id-card' })),
      ...receipts.map((d) => ({ ...d, docType: 'receipt' })),
      ...certificates.map((d) => ({ ...d, docType: 'certificate' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: combined.length,
      breakdown: { idCards: ids.length, receipts: receipts.length, certificates: certificates.length },
      data: combined,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/documents/stats
 * Returns aggregate counts and recent activity.
 */
router.get('/stats', async (_req, res, next) => {
  try {
    const [idCount, receiptCount, certCount] = await Promise.all([
      IdCard.countDocuments(),
      Receipt.countDocuments(),
      Certificate.countDocuments(),
    ]);

    const totalAmount = await Receipt.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalDocuments: idCount + receiptCount + certCount,
        idCards: idCount,
        receipts: receiptCount,
        certificates: certCount,
        totalDonationAmount: totalAmount[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
