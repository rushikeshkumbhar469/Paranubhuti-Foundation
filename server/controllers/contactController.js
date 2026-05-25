const Contact = require('../models/Contact');
const { sendMail, buildEmailHtml } = require('../utils/mailer');

/**
 * POST /api/contact
 * Submit a support/contact message.
 */
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const record = await Contact.create({ name, email, subject, message });

    // Notify internal team
    if (process.env.MAIL_USER) {
      try {
        await sendMail({
          to: process.env.MAIL_USER,
          subject: `[Support] ${subject} – from ${name}`,
          html: buildEmailHtml({
            recipientName: 'Team',
            headline: 'New Support Message Received',
            body: `
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
            `,
          }),
        });

        // Auto-reply to sender
        await sendMail({
          to: email,
          subject: 'We received your message – Paranubhuti Foundation',
          html: buildEmailHtml({
            recipientName: name,
            headline: 'Message Received',
            body: `<p>Thank you for reaching out. We have received your message regarding "<strong>${subject}</strong>" and our team will get back to you within 1-2 business days.</p>`,
          }),
        });
      } catch (mailErr) {
        console.warn('[Mailer] Could not send contact notification:', mailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
      data: { id: record._id, subject: record.subject, createdAt: record.createdAt },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/contact
 * List all contact submissions (admin use).
 */
exports.getAllContacts = async (_req, res, next) => {
  try {
    const records = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/contact/:id/status
 * Update status of a contact submission.
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const VALID = ['open', 'in-progress', 'resolved'];
    if (!VALID.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${VALID.join(', ')}` });
    }
    const record = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
