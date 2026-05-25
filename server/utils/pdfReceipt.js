const PDFDocument = require('pdfkit');
const fs = require('fs');
const { generateQRCode } = require('./qrGenerator');

const BRAND = '#e11d48';
const DARK = '#0f172a';
const MID = '#475569';
const BORDER = '#e2e8f0';

/**
 * Generate a Donation Receipt PDF.
 * @param {object} data - Receipt data
 * @param {string} outputPath - absolute file path for the output PDF
 */
const generateReceiptPDF = async (data, outputPath) => {
  const { receiptNumber, fullName, amount, date, project, pan } = data;

  const qrText = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/receipt/${receiptNumber}`;
  const qrDataUrl = await generateQRCode(qrText);
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A5', margin: 40 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const W = doc.page.width - 80; // usable width

    // ── Outer border ────────────────────────────────────────────────
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .strokeColor(BORDER).lineWidth(1).stroke();

    // ── Header ───────────────────────────────────────────────────────
    doc
      .font('Helvetica-Bold').fontSize(16).fillColor(DARK)
      .text('PARANUBHUTI', 40, 40, { align: 'center', width: W });
    doc
      .font('Helvetica').fontSize(8).fillColor(MID)
      .text('Foundation For Global Equality', 40, 60, { align: 'center', width: W });
    doc
      .font('Helvetica').fontSize(7).fillColor('#94a3b8')
      .text('122 Galitodia Way, Sector 4, New Delhi, 110015, India', 40, 72, { align: 'center', width: W });
    doc
      .font('Helvetica').fontSize(7).fillColor('#94a3b8')
      .text('Reg No. 80-2023-PBD3', 40, 84, { align: 'center', width: W });

    // ── Receipt number (top right) ───────────────────────────────────
    doc.font('Helvetica').fontSize(7).fillColor(BRAND)
      .text('RECEIPT NO.', doc.page.width - 150, 40, { width: 110, align: 'right', characterSpacing: 1 });
    doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
      .text(receiptNumber, doc.page.width - 150, 52, { width: 110, align: 'right' });

    // ── Divider ──────────────────────────────────────────────────────
    let y = 100;
    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor(BORDER).lineWidth(1).stroke();
    y += 12;

    // ── Title ────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
      .text('OFFICIAL DONATION RECEIPT', 40, y, { align: 'center', width: W, characterSpacing: 1.5 });
    y += 22;

    // ── Details ──────────────────────────────────────────────────────
    const drawRow = (label, value, yPos) => {
      doc.font('Helvetica-Bold').fontSize(8).fillColor(MID)
        .text(label, 40, yPos, { width: 140 });
      doc.font('Helvetica').fontSize(8).fillColor(DARK)
        .text(value || '—', 180, yPos, { width: W - 140, align: 'right' });
      return yPos + 18;
    };

    y = drawRow('RECEIVED FROM', fullName, y);
    y = drawRow('DATE', date, y);
    y = drawRow('AMOUNT (INR)', `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, y);
    y = drawRow('PURPOSE', project, y);
    if (pan) y = drawRow('PAN / TAX ID', pan, y);

    // ── Divider ──────────────────────────────────────────────────────
    y += 6;
    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor(BORDER).lineWidth(0.5).stroke();
    y += 14;

    // ── Disclaimer ───────────────────────────────────────────────────
    doc.font('Helvetica').fontSize(7).fillColor('#64748b')
      .text(
        'This is to acknowledge the generous contribution made to the Paranubhuti Foundation. ' +
          'This receipt is valid for tax exemption under Section 80G of the Income Tax Act. ' +
          'We thank you for your support in building a more equitable future.',
        40,
        y,
        { width: W, align: 'justify', lineGap: 3 }
      );
    y += 52;

    // ── Divider ──────────────────────────────────────────────────────
    doc.moveTo(40, y).lineTo(doc.page.width - 40, y).strokeColor(BORDER).lineWidth(0.5).stroke();
    y += 14;

    // ── QR Code + Signatory ──────────────────────────────────────────
    doc.image(qrBuffer, 40, y, { width: 60, height: 60 });
    doc.font('Helvetica').fontSize(6.5).fillColor('#94a3b8')
      .text('Scan to verify', 40, y + 62, { width: 60, align: 'center' });

    const sigX = doc.page.width - 150;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK)
      .text('A.K. Sharma', sigX, y + 10, { width: 110, align: 'center' });
    doc.moveTo(sigX, y + 22).lineTo(sigX + 110, y + 22).strokeColor(DARK).lineWidth(0.5).stroke();
    doc.font('Helvetica').fontSize(7).fillColor(MID)
      .text('AUTHORIZED SIGNATORY', sigX, y + 26, { width: 110, align: 'center', characterSpacing: 0.5 });
    doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
      .text('PARANUBHUTI FOUNDATION', sigX, y + 38, { width: 110, align: 'center', characterSpacing: 0.5 });

    // ── Footer ───────────────────────────────────────────────────────
    const pageH = doc.page.height;
    doc.rect(20, pageH - 32, doc.page.width - 40, 20).fill('#f8fafc');
    doc.font('Helvetica').fontSize(6.5).fillColor('#94a3b8')
      .text('This document is computer-generated and digitally verified by Paranubhuti Foundation.', 40, pageH - 27, {
        align: 'center',
        width: W,
      });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

module.exports = { generateReceiptPDF };
