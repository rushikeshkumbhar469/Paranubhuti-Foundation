const path = require('path');
const fs = require('fs');
const Receipt = require('../models/Receipt');
const { generateReceiptPDF } = require('../utils/pdfReceipt');
const { generateDocNumber, formatDate } = require('../utils/helpers');
const { sendMail, buildEmailHtml } = require('../utils/mailer');

const STORAGE_DIR = path.join(__dirname, '../storage/receipts');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

/**
 * POST /api/receipt/generate
 * Generate a donation receipt PDF and stream it back.
 */
exports.generateReceipt = async (req, res, next) => {
  try {
    const { fullName, amount, date, project, pan, email } = req.body;

    const receiptNumber = generateDocNumber('PR', 5);
    const formattedDate = formatDate(date) || date;
    const fileName = `receipt_${receiptNumber}.pdf`;
    const outputPath = path.join(STORAGE_DIR, fileName);

    await generateReceiptPDF(
      { receiptNumber, fullName, amount: Number(amount), date: formattedDate, project, pan: pan || '' },
      outputPath
    );

    const record = await Receipt.create({
      receiptNumber,
      fullName,
      email: email || '',
      amount: Number(amount),
      date: formattedDate,
      project,
      pan: pan || '',
      pdfPath: outputPath,
      pdfUrl: `/storage/receipts/${fileName}`,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fs.createReadStream(outputPath).pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/receipt/send-email
 * Generate a receipt and send it via email.
 */
exports.sendReceiptEmail = async (req, res, next) => {
  try {
    const { fullName, amount, date, project, pan, email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email address is required.' });

    const receiptNumber = generateDocNumber('PR', 5);
    const formattedDate = formatDate(date) || date;
    const fileName = `receipt_${receiptNumber}.pdf`;
    const outputPath = path.join(STORAGE_DIR, fileName);

    await generateReceiptPDF(
      { receiptNumber, fullName, amount: Number(amount), date: formattedDate, project, pan: pan || '' },
      outputPath
    );

    await Receipt.create({
      receiptNumber,
      fullName,
      email,
      amount: Number(amount),
      date: formattedDate,
      project,
      pan: pan || '',
      pdfPath: outputPath,
      pdfUrl: `/storage/receipts/${fileName}`,
      emailSent: true,
    });

    const html = buildEmailHtml({
      recipientName: fullName,
      headline: 'Your Donation Receipt',
      body: `<p>Please find your official donation receipt (No. <strong>${receiptNumber}</strong>) attached to this email. 
             The receipt is valid for tax exemption under Section 80G of the Income Tax Act.</p>`,
    });

    await sendMail({
      to: email,
      subject: `Paranubhuti Foundation – Donation Receipt ${receiptNumber}`,
      html,
      pdfPath: outputPath,
      pdfName: fileName,
    });

    res.json({
      success: true,
      message: `Receipt ${receiptNumber} sent to ${email}`,
      receiptNumber,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/receipt
 * List all receipts.
 */
exports.getAllReceipts = async (_req, res, next) => {
  try {
    const records = await Receipt.find().sort({ createdAt: -1 }).select('-pdfPath');
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/receipt/:receiptNumber
 * Verify a receipt by its number.
 */
exports.verifyReceipt = async (req, res, next) => {
  try {
    const record = await Receipt.findOne({ receiptNumber: req.params.receiptNumber }).select('-pdfPath');
    if (!record) return res.status(404).json({ success: false, message: 'Receipt not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
