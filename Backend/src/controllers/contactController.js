const Contact = require('../models/Contact');

/**
 * Submit support contact form
 * @route POST /api/contact
 * @access Public
 */
const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: '✅ Message sent! We will get back to you shortly.',
      data: newMessage,
    });
  } catch (error) {
    console.error(`Error submitting contact form: ${error.message}`);
    res.status(500).json({ message: 'Server error. Failed to send message.' });
  }
};

module.exports = { createContactMessage };
