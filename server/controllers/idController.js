const path = require('path');
const fs = require('fs');
const IdCard = require('../models/IdCard');
const { generateIdCardPDF } = require('../utils/pdfIdCard');
const { generateDocNumber, getValidityDate } = require('../utils/helpers');

// Ensure storage directories exist
const STORAGE_DIR = path.join(__dirname, '../storage/ids');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

/**
 * POST /api/id/generate
 * Generate and download a volunteer ID card PDF.
 */
exports.generateId = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, role, joinDate, bloodGroup } = req.body;

    const idNumber = generateDocNumber('PF', 4);
    const validUntil = getValidityDate();
    const fileName = `id_${idNumber}.pdf`;
    const outputPath = path.join(STORAGE_DIR, fileName);

    await generateIdCardPDF(
      { idNumber, fullName, email, phoneNumber, role, joinDate, bloodGroup: bloodGroup || '', validUntil },
      outputPath
    );

    // Save record to DB
    const record = await IdCard.create({
      idNumber,
      fullName,
      email,
      phoneNumber,
      role,
      joinDate,
      bloodGroup: bloodGroup || '',
      validUntil,
      pdfPath: outputPath,
      pdfUrl: `/storage/ids/${fileName}`,
    });

    // Stream PDF to client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fs.createReadStream(outputPath).pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/id
 * List all generated ID records (admin use).
 */
exports.getAllIds = async (_req, res, next) => {
  try {
    const records = await IdCard.find().sort({ createdAt: -1 }).select('-pdfPath');
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/id/:idNumber
 * Verify a specific ID card by its number.
 */
exports.verifyId = async (req, res, next) => {
  try {
    const record = await IdCard.findOne({ idNumber: req.params.idNumber }).select('-pdfPath');
    if (!record) return res.status(404).json({ success: false, message: 'ID card not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
