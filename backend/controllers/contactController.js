const ContactMessage = require('../models/ContactMessage');

const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }

    const created = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim()
    });

    return res.status(201).json({
      message: 'Thanks for reaching out. We will get back to you soon.',
      contactMessage: created
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error submitting contact message',
      error: error.message
    });
  }
};

module.exports = {
  createContactMessage
};
