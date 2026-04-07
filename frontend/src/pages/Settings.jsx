import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import styles from './Settings.module.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: 'Shnoor HireHub',
    companyEmail: 'admin@hirehub.com',
    companyPhone: '+1 (555) 123-4567',
    address: '123 Business Street, Suite 100, New York, NY 10001',
  });
  const [edited, setEdited] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setEdited(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      setEdited(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <AdminLayout currentPage="/admin/settings">
      <div className={styles.container}>
        <div className={styles.settingsCard}>
          <h3>Platform Settings</h3>

          <div className={styles.formGroup}>
            <label htmlFor="platformName">Platform Name</label>
            <input
              type="text"
              id="platformName"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="companyEmail">Company Email</label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={settings.companyEmail}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="companyPhone">Company Phone</label>
            <input
              type="tel"
              id="companyPhone"
              name="companyPhone"
              value={settings.companyPhone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={settings.address}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!edited || saving}
            >
              {saving ? 'Saving...' : '💾 Save Settings'}
            </button>
            {edited && (
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setEdited(false);
                  setSettings({
                    platformName: 'Shnoor HireHub',
                    companyEmail: 'admin@hirehub.com',
                    companyPhone: '+1 (555) 123-4567',
                    address: '123 Business Street, Suite 100, New York, NY 10001',
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className={styles.settingsCard}>
          <h3>Subscription Plans</h3>
          <div className={styles.plansGrid}>
            <div className={styles.planCard}>
              <h4>Basic</h4>
              <p className={styles.price}>$29<span>/month</span></p>
              <ul>
                <li>✓ Up to 10 Job Postings</li>
                <li>✓ Basic Analytics</li>
                <li>✓ Email Support</li>
              </ul>
            </div>

            <div className={styles.planCard}>
              <h4>Pro</h4>
              <p className={styles.price}>$79<span>/month</span></p>
              <ul>
                <li>✓ Up to 50 Job Postings</li>
                <li>✓ Advanced Analytics</li>
                <li>✓ Priority Support</li>
              </ul>
            </div>

            <div className={styles.planCard}>
              <h4>Enterprise</h4>
              <p className={styles.price}>$199<span>/month</span></p>
              <ul>
                <li>✓ Unlimited Job Postings</li>
                <li>✓ Custom Analytics</li>
                <li>✓ Dedicated Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
