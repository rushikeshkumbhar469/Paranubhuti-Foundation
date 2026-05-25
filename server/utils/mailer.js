const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Send an email with an optional PDF attachment.
 * @param {object} options
 * @param {string} options.to        - Recipient email
 * @param {string} options.subject   - Email subject
 * @param {string} options.html      - HTML body
 * @param {string} [options.pdfPath] - Absolute path to PDF attachment
 * @param {string} [options.pdfName] - Filename for the attachment
 */
const sendMail = async ({ to, subject, html, pdfPath, pdfName }) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    attachments: pdfPath
      ? [
          {
            filename: pdfName || path.basename(pdfPath),
            path: pdfPath,
            contentType: 'application/pdf',
          },
        ]
      : [],
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

/**
 * Build a simple branded HTML email body.
 */
const buildEmailHtml = ({ recipientName, headline, body }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #e11d48; padding: 24px 32px; }
        .header h1 { color: #fff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.04em; }
        .header p { color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px; }
        .body { padding: 32px; color: #1e293b; }
        .body h2 { font-size: 18px; font-weight: 600; margin-top: 0; }
        .body p { font-size: 14px; line-height: 1.7; color: #475569; }
        .footer { padding: 20px 32px; background: #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Paranubhuti Foundation</h1>
          <p>Stand For Humanity</p>
        </div>
        <div class="body">
          <h2>${headline}</h2>
          <p>Dear ${recipientName},</p>
          ${body}
          <p>Thank you for being a valued part of our community.</p>
          <p style="margin-bottom:0;">Warm regards,<br /><strong>Paranubhuti Foundation Team</strong></p>
        </div>
        <div class="footer">
          122 Galitodia Way, Sector 4, New Delhi, 110015, India &nbsp;|&nbsp; Reg No. 80-2023-PBD3
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { sendMail, buildEmailHtml };
