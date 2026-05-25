const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const { generateCertificatePDF } = require('../utils/pdfCertificate');
const { generateDocNumber, formatDate } = require('../utils/helpers');
const { sendMail, buildEmailHtml } = require('../utils/mailer');

const STORAGE_DIR = path.join(__dirname, '../storage/certificates');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const VALID_TYPES = ['participation', 'internship', 'achievement', 'training'];

/**
 * POST /api/certificate/generate
 * Generate a certificate PDF and stream it.
 */
exports.generateCertificate = async (req, res, next) => {
  try {
    const { type, fullName, title, date, email } = req.body;

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: `Invalid certificate type. Must be one of: ${VALID_TYPES.join(', ')}` });
    }

    const certificateNumber = generateDocNumber('PC', 5);
    const formattedDate = formatDate(date) || date;
    const fileName = `certificate_${certificateNumber}.pdf`;
    const outputPath = path.join(STORAGE_DIR, fileName);

    await generateCertificatePDF(
      { certificateNumber, type, fullName, title, date: formattedDate },
      outputPath
    );

    await Certificate.create({
      certificateNumber,
      type,
      fullName,
      title,
      date: formattedDate,
      email: email || '',
      pdfPath: outputPath,
      pdfUrl: `/storage/certificates/${fileName}`,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fs.createReadStream(outputPath).pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/certificate/send-email
 * Generate a certificate and email it.
 */
exports.sendCertificateEmail = async (req, res, next) => {
  try {
    const { type, fullName, title, date, email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email address is required.' });

    const certificateNumber = generateDocNumber('PC', 5);
    const formattedDate = formatDate(date) || date;
    const fileName = `certificate_${certificateNumber}.pdf`;
    const outputPath = path.join(STORAGE_DIR, fileName);

    await generateCertificatePDF(
      { certificateNumber, type, fullName, title, date: formattedDate },
      outputPath
    );

    await Certificate.create({
      certificateNumber,
      type,
      fullName,
      title,
      date: formattedDate,
      email,
      pdfPath: outputPath,
      pdfUrl: `/storage/certificates/${fileName}`,
      emailSent: true,
    });

    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    const html = buildEmailHtml({
      recipientName: fullName,
      headline: `Your ${typeLabel} Certificate`,
      body: `<p>Congratulations! Please find your official <strong>${typeLabel} Certificate</strong> (No. <strong>${certificateNumber}</strong>) attached. 
             This certificate acknowledges your valuable contribution to Paranubhuti Foundation.</p>`,
    });

    await sendMail({
      to: email,
      subject: `Paranubhuti Foundation – ${typeLabel} Certificate ${certificateNumber}`,
      html,
      pdfPath: outputPath,
      pdfName: fileName,
    });

    res.json({
      success: true,
      message: `Certificate ${certificateNumber} sent to ${email}`,
      certificateNumber,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/certificate
 * List all certificates.
 */
exports.getAllCertificates = async (_req, res, next) => {
  try {
    const records = await Certificate.find().sort({ createdAt: -1 }).select('-pdfPath');
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/certificate/:certificateNumber
 * Verify a certificate.
 */
exports.verifyCertificate = async (req, res, next) => {
  try {
    const record = await Certificate.findOne({ certificateNumber: req.params.certificateNumber }).select('-pdfPath');
    if (!record) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
