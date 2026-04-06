import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import styles from './Subscriptions.module.css';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionAPI.getAll();
      setSubscriptions(res.data.data);
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: styles.badgeActive,
      inactive: styles.badgeInactive,
      expired: styles.badgeExpired,
    };
    return badges[status] || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <AdminLayout currentPage="/admin/subscriptions">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/subscriptions">
      {error && <div className={styles.alert}>{error}</div>}

      <div className={styles.tableContainer}>
        <h3>Subscription Management</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Plan Type</th>
              <th>Amount</th>
              <th>Start Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.empty}>No subscriptions found</td>
              </tr>
            ) : (
              subscriptions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.company_name}</td>
                  <td>{sub.plan_name}</td>
                  <td>${parseFloat(sub.amount ?? sub.price ?? 0).toFixed(2)}</td>
                  <td>{formatDate(sub.start_date)}</td>
                  <td>{formatDate(sub.expiry_date)}</td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadge(sub.status)}`}>
                      {sub.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Subscriptions;
