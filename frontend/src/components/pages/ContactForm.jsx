import { useState } from 'react';
import { contactAPI } from '../../api';
import styles from './OpeningPage.module.css';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

const ContactForm = () => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await contactAPI.sendMessage(formData);
      setSuccess(response.data?.message || 'Message sent successfully');
      setFormData(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>
        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>
      </div>

      <label>
        Subject
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="How can we help?"
          required
        />
      </label>

      <label>
        Message
        <textarea
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your question or requirement"
          required
        />
      </label>

      {error && <div className={styles.formAlertError}>{error}</div>}
      {success && <div className={styles.formAlertSuccess}>{success}</div>}

      <button type="submit" className={styles.applyBtn} disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
