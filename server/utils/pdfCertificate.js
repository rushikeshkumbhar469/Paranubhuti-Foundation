const PDFDocument = require('pdfkit');
const fs = require('fs');
const { generateQRCode } = require('./qrGenerator');

const BRAND = '#e11d48';
const DARK = '#0f172a';
const MID = '#475569';
const BORDER = '#e2e8f0';

const certificateMeta = {
  participation: {
    title: 'Certificate of Participation',
    bodyText: 'has actively participated and successfully completed the program titled',
  },
  internship: {
    title: 'Internship Completion Certificate',
    bodyText: 'has successfully completed the internship program titled',
  },
  achievement: {
    title: 'Certificate of Achievement',
    bodyText: 'has demonstrated outstanding performance and achievement in',
  },
  training: {
    title: 'Training Completion Certificate',
    bodyText: 'has successfully completed the training course titled',
  },
};

/**
 * Generate a Certificate PDF (A4 landscape).
 * @param {object} data - Certificate data
 * @param {string} outputPath - absolute path to save the PDF
 */
const generateCertificatePDF = async (data, outputPath) => {
  const { certificateNumber, type, fullName, title, date } = data;
  const meta = certificateMeta[type] || certificateMeta.participation;

  const qrText = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/certificate/${certificateNumber}`;
  const qrDataUrl = await generateQRCode(qrText);
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const PW = doc.page.width;   // 841.89
    const PH = doc.page.height;  // 595.28
    const M = 40;

    // ── White background ─────────────────────────────────────────────
    doc.rect(0, 0, PW, PH).fill('#ffffff');

    // ── Outer decorative border ──────────────────────────────────────
    doc.rect(M - 10, M - 10, PW - (M - 10) * 2, PH - (M - 10) * 2)
      .strokeColor(BRAND).lineWidth(2).stroke();
    doc.rect(M - 5, M - 5, PW - (M - 5) * 2, PH - (M - 5) * 2)
      .strokeColor('#fecdd3').lineWidth(0.5).stroke();

    // ── Header: Foundation name ──────────────────────────────────────
    doc.font('Helvetica').fontSize(8).fillColor('#94a3b8')
      .text('PARANUBHUTI FOUNDATION', M, M + 6, {
        width: PW - M * 2,
        align: 'center',
        characterSpacing: 4,
      });
    doc.font('Helvetica').fontSize(7).fillColor('#cbd5e1')
      .text('Stand For Humanity', M, M + 18, {
        width: PW - M * 2,
        align: 'center',
      });

    // ── Decorative line ───────────────────────────────────────────────
    const lineY = M + 35;
    doc.moveTo(M + 20, lineY).lineTo(PW / 2 - 60, lineY).strokeColor(BORDER).lineWidth(0.5).stroke();
    doc.circle(PW / 2, lineY, 4).fill(BRAND);
    doc.moveTo(PW / 2 + 60, lineY).lineTo(PW - M - 20, lineY).strokeColor(BORDER).lineWidth(0.5).stroke();

    // ── Certificate title ────────────────────────────────────────────
    const titleY = lineY + 20;
    doc.font('Helvetica-Bold').fontSize(28).fillColor(BRAND)
      .text(meta.title, M, titleY, {
        width: PW - M * 2,
        align: 'center',
      });

    // ── "This is to certify that" ────────────────────────────────────
    const certifyY = titleY + 50;
    doc.font('Helvetica').fontSize(10).fillColor(MID)
      .text('T H I S   I S   T O   C E R T I F Y   T H A T', M, certifyY, {
        width: PW - M * 2,
        align: 'center',
      });

    // ── Recipient name ────────────────────────────────────────────────
    const nameY = certifyY + 20;
    doc.font('Helvetica-Bold').fontSize(32).fillColor(DARK)
      .text(fullName, M, nameY, {
        width: PW - M * 2,
        align: 'center',
      });

    // ── Underline for name ────────────────────────────────────────────
    const nameUnderY = nameY + 42;
    doc.moveTo(PW / 2 - 120, nameUnderY).lineTo(PW / 2 + 120, nameUnderY)
      .strokeColor(BRAND).lineWidth(1).stroke();

    // ── Body text ─────────────────────────────────────────────────────
    const bodyY = nameUnderY + 14;
    doc.font('Helvetica').fontSize(10).fillColor(MID)
      .text(meta.bodyText, M, bodyY, { width: PW - M * 2, align: 'center' });

    // ── Program title ─────────────────────────────────────────────────
    const progY = bodyY + 18;
    doc.font('Helvetica-Bold').fontSize(14).fillColor(DARK)
      .text(`"${title}"`, M, progY, { width: PW - M * 2, align: 'center' });

    // ── Bottom section ────────────────────────────────────────────────
    const bottomY = PH - M - 60;

    // QR code (left)
    doc.image(qrBuffer, M + 10, bottomY - 10, { width: 52, height: 52 });
    doc.font('Helvetica').fontSize(6).fillColor('#94a3b8')
      .text('Verify Certificate', M + 10, bottomY + 44, { width: 52, align: 'center' });

    // Certificate number (center-left)
    doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
      .text('CERTIFICATE NO.', M + 80, bottomY + 16, { characterSpacing: 1 });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(MID)
      .text(certificateNumber, M + 80, bottomY + 27);

    // Date (center)
    doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
      .text('DATE ISSUED', PW / 2 - 40, bottomY + 16, { characterSpacing: 1 });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(MID)
      .text(date, PW / 2 - 40, bottomY + 27);

    // Signatory (right)
    const sigX = PW - M - 130;
    doc.font('Helvetica-Bold').fontSize(11).fillColor(DARK)
      .text('A.K. Sharma', sigX, bottomY + 4, { width: 120, align: 'center' });
    doc.moveTo(sigX, bottomY + 20).lineTo(sigX + 120, bottomY + 20)
      .strokeColor(DARK).lineWidth(0.5).stroke();
    doc.font('Helvetica').fontSize(7).fillColor(MID)
      .text('PROJECT DIRECTOR', sigX, bottomY + 26, { width: 120, align: 'center', characterSpacing: 1 });
    doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
      .text('Paranubhuti Foundation', sigX, bottomY + 37, { width: 120, align: 'center' });

    // ── Bottom strip ──────────────────────────────────────────────────
    doc.rect(0, PH - 22, PW, 22).fill('#f8fafc');
    doc.font('Helvetica').fontSize(6.5).fillColor('#94a3b8')
      .text(
        'This certificate is issued by Paranubhuti Foundation and is digitally verified. Reg No. 80-2023-PBD3',
        M,
        PH - 16,
        { width: PW - M * 2, align: 'center' }
      );

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

module.exports = { generateCertificatePDF };
