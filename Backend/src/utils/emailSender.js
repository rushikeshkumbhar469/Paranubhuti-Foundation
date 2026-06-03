const nodemailer = require('nodemailer');

/**
 * Sends an email with an attached PDF file.
 * 
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject line
 * @param {string} params.body - Email body text
 * @param {Buffer} params.pdfBuffer - PDF file buffer to attach
 * @param {string} params.filename - Name of the attachment file
 */
const sendEmailWithPdf = async ({ to, subject, body, pdfBuffer, filename }) => {
  // Setup Nodemailer transporter using credentials from .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: parseInt(process.env.SMTP_PORT, 10) === 465, // True for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Paranubhuti Foundation Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: body,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-corners: 8px;">
        <h2 style="color: #e11d48; margin-top: 0;">Paranubhuti Foundation</h2>
        <p style="font-size: 15px; color: #334155; line-height: 1.5;">Hello,</p>
        <p style="font-size: 15px; color: #334155; line-height: 1.5;">We are pleased to inform you that your request has been reviewed and approved by the administration. Your official document is attached to this email as a PDF file.</p>
        <p style="font-size: 15px; color: #334155; line-height: 1.5;">${body.replace(/\n/g, '<br/>')}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">This is an automated system email. Please do not reply directly to this message. For any support inquiries, contact us at support@paranubhuti.org.</p>
      </div>
    `,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email successfully sent to ${to} with attachment: ${filename}`);
};

module.exports = { sendEmailWithPdf };
