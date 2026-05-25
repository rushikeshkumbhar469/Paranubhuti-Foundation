const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { generateQRCode } = require('./qrGenerator');

const BRAND = '#e11d48';
const DARK = '#0f172a';
const MID = '#475569';
const LIGHT = '#f1f5f9';

/**
 * Generate a Volunteer ID Card PDF.
 * @param {object} data - ID card data
 * @param {string} outputPath - absolute path to save the PDF
 */
const generateIdCardPDF = async (data, outputPath) => {
  const { idNumber, fullName, role, joinDate, validUntil, phoneNumber, email } = data;

  const qrText = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/id/${idNumber}`;
  const qrDataUrl = await generateQRCode(qrText);
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [252, 396], margin: 0 }); // credit-card-like portrait
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // ── Background ──────────────────────────────────────────────────
    doc.rect(0, 0, 252, 396).fill('#1e293b');

    // ── Header strip ────────────────────────────────────────────────
    doc.rect(0, 0, 252, 48).fill(BRAND);
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor('#ffffff')
      .text('PARANUBHUTI', 0, 10, { align: 'center', characterSpacing: 2 });
    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor('rgba(255,255,255,0.7)')
      .text('FOUNDATION', 0, 26, { align: 'center', characterSpacing: 3 });
    doc
      .font('Helvetica')
      .fontSize(6)
      .fillColor('rgba(255,255,255,0.5)')
      .text('Stand For Humanity', 0, 37, { align: 'center' });

    // ── Photo placeholder ────────────────────────────────────────────
    doc.rect(96, 60, 60, 60).fillAndStroke('#334155', '#475569');
    doc
      .font('Helvetica')
      .fontSize(20)
      .fillColor('#64748b')
      .text('ID', 96, 78, { width: 60, align: 'center' });

    // ── Name & Role ──────────────────────────────────────────────────
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor('#f8fafc')
      .text(fullName, 12, 134, { align: 'center', width: 228 });

    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor(BRAND)
      .text(role.toUpperCase(), 12, 148, { align: 'center', width: 228, characterSpacing: 1.5 });

    // ── Divider ──────────────────────────────────────────────────────
    doc.moveTo(20, 164).lineTo(232, 164).strokeColor('#334155').lineWidth(0.5).stroke();

    // ── Details grid ─────────────────────────────────────────────────
    const col1x = 20, col2x = 136;
    let y = 172;
    const drawField = (label, value, x, yPos) => {
      doc.font('Helvetica').fontSize(6).fillColor('#64748b').text(label, x, yPos, { characterSpacing: 1 });
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#f1f5f9').text(value || '—', x, yPos + 9);
    };

    drawField('ID NUMBER', idNumber, col1x, y);
    drawField('JOINED ON', joinDate, col2x, y);
    y += 32;
    drawField('PHONE', phoneNumber, col1x, y);
    drawField('VALIDITY', validUntil, col2x, y);
    y += 32;
    drawField('EMAIL', email, col1x, y);

    // ── Divider ──────────────────────────────────────────────────────
    y += 28;
    doc.moveTo(20, y).lineTo(232, y).strokeColor('#334155').lineWidth(0.5).stroke();
    y += 10;

    // ── QR Code + Signatory ──────────────────────────────────────────
    doc.image(qrBuffer, col1x, y, { width: 56, height: 56 });

    doc
      .font('Helvetica')
      .fontSize(6)
      .fillColor('#64748b')
      .text('AUTHORIZED SIGNATORY', col2x, y, { characterSpacing: 0.8 });
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#f1f5f9')
      .text('A.K. Sharma', col2x, y + 10);
    doc
      .font('Helvetica')
      .fontSize(6)
      .fillColor('#64748b')
      .text('Project Director', col2x, y + 21);
    doc
      .font('Helvetica')
      .fontSize(6)
      .fillColor('#475569')
      .text('Paranubhuti Foundation', col2x, y + 31);

    // ── Footer strip ─────────────────────────────────────────────────
    doc.rect(0, 368, 252, 28).fill('#0f172a');
    doc
      .font('Helvetica')
      .fontSize(6)
      .fillColor('#475569')
      .text('This is a representation of your printed ID card.', 0, 378, { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

module.exports = { generateIdCardPDF };
