const path = require('path');
const fs = require('fs');
const IdCard = require('../models/IdCard');
const Receipt = require('../models/Receipt');
const Certificate = require('../models/Certificate');
const { generateIdCardPDF } = require('./pdfIdCard');
const { generateReceiptPDF } = require('./pdfReceipt');
const { generateCertificatePDF } = require('./pdfCertificate');
const { generateDocNumber, formatDate, getValidityDate } = require('./helpers');
const { sendMail, buildEmailHtml } = require('./mailer');

const STORAGE = {
  'id-card': path.join(__dirname, '../storage/ids'),
  receipt: path.join(__dirname, '../storage/receipts'),
  certificate: path.join(__dirname, '../storage/certificates'),
};

Object.values(STORAGE).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/**
 * Generate the document PDF and persist the record after admin approval.
 */
async function fulfillDocumentRequest(request) {
  const { docType, payload, deliveryMethod, email } = request;

  if (docType === 'id-card') {
    return fulfillIdCard(payload);
  }
  if (docType === 'receipt') {
    return fulfillReceipt(payload, deliveryMethod, email);
  }
  if (docType === 'certificate') {
    return fulfillCertificate(payload, deliveryMethod, email);
  }

  throw new Error(`Unknown document type: ${docType}`);
}

async function fulfillIdCard(payload) {
  const { fullName, email, phoneNumber, role, joinDate, bloodGroup } = payload;

  const idNumber = generateDocNumber('PF', 4);
  const validUntil = getValidityDate();
  const fileName = `id_${idNumber}.pdf`;
  const outputPath = path.join(STORAGE['id-card'], fileName);

  await generateIdCardPDF(
    {
      idNumber,
      fullName,
      email,
      phoneNumber,
      role,
      joinDate,
      bloodGroup: bloodGroup || '',
      validUntil,
    },
    outputPath
  );

  await IdCard.create({
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

  return {
    documentNumber: idNumber,
    pdfPath: outputPath,
    pdfUrl: `/storage/ids/${fileName}`,
    fileName,
  };
}

async function fulfillReceipt(payload, deliveryMethod, requestEmail) {
  const { fullName, amount, date, project, pan, email } = payload;
  const recipientEmail = email || requestEmail;

  const receiptNumber = generateDocNumber('PR', 5);
  const formattedDate = formatDate(date) || date;
  const fileName = `receipt_${receiptNumber}.pdf`;
  const outputPath = path.join(STORAGE.receipt, fileName);

  await generateReceiptPDF(
    {
      receiptNumber,
      fullName,
      amount: Number(amount),
      date: formattedDate,
      project,
      pan: pan || '',
    },
    outputPath
  );

  let emailSent = false;
  if (deliveryMethod === 'email' && recipientEmail) {
    try {
      const html = buildEmailHtml({
        recipientName: fullName,
        headline: 'Your Donation Receipt',
        body: `<p>Your official donation receipt (No. <strong>${receiptNumber}</strong>) has been approved and is attached to this email.</p>`,
      });

      await sendMail({
        to: recipientEmail,
        subject: `Paranubhuti Foundation – Donation Receipt ${receiptNumber}`,
        html,
        pdfPath: outputPath,
        pdfName: fileName,
      });
      emailSent = true;
    } catch (mailErr) {
      console.error(`[Mailer Error] Failed to send receipt ${receiptNumber} email:`, mailErr.message);
    }
  }

  await Receipt.create({
    receiptNumber,
    fullName,
    email: recipientEmail || '',
    amount: Number(amount),
    date: formattedDate,
    project,
    pan: pan || '',
    pdfPath: outputPath,
    pdfUrl: `/storage/receipts/${fileName}`,
    emailSent,
  });

  return {
    documentNumber: receiptNumber,
    pdfPath: outputPath,
    pdfUrl: `/storage/receipts/${fileName}`,
    fileName,
    emailSent,
  };
}

async function fulfillCertificate(payload, deliveryMethod, requestEmail) {
  const { type, fullName, title, date, email } = payload;
  const recipientEmail = email || requestEmail;

  const certificateNumber = generateDocNumber('PC', 5);
  const formattedDate = formatDate(date) || date;
  const fileName = `certificate_${certificateNumber}.pdf`;
  const outputPath = path.join(STORAGE.certificate, fileName);

  await generateCertificatePDF(
    { certificateNumber, type, fullName, title, date: formattedDate },
    outputPath
  );

  let emailSent = false;
  if (deliveryMethod === 'email' && recipientEmail) {
    try {
      const html = buildEmailHtml({
        recipientName: fullName,
        headline: 'Your Certificate',
        body: `<p>Your official certificate (No. <strong>${certificateNumber}</strong>) has been approved and is attached to this email.</p>`,
      });

      await sendMail({
        to: recipientEmail,
        subject: `Paranubhuti Foundation – Certificate ${certificateNumber}`,
        html,
        pdfPath: outputPath,
        pdfName: fileName,
      });
      emailSent = true;
    } catch (mailErr) {
      console.error(`[Mailer Error] Failed to send certificate ${certificateNumber} email:`, mailErr.message);
    }
  }

  await Certificate.create({
    certificateNumber,
    type,
    fullName,
    title,
    date: formattedDate,
    email: recipientEmail || '',
    pdfPath: outputPath,
    pdfUrl: `/storage/certificates/${fileName}`,
    emailSent,
  });

  return {
    documentNumber: certificateNumber,
    pdfPath: outputPath,
    pdfUrl: `/storage/certificates/${fileName}`,
    fileName,
    emailSent,
  };
}

module.exports = { fulfillDocumentRequest };
