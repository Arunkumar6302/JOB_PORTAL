import React, { useEffect, useState } from 'react';
import { userPortalAPI } from '../../api';
import UserLayout from '../../components/user/UserLayout';
import styles from './UserCommon.module.css';

const UserAssessments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await userPortalAPI.getAssessments();
        setItems(response.data.data || []);
      } catch (err) {
        setError('Unable to fetch assessments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <UserLayout currentPage="/user/assessments" pageTitle="Assessments">
      {error && <div className={styles.alert}>{error}</div>}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <section className={styles.card}>
          <h3>Assessment Window</h3>
          {!items.length ? (
            <p className={styles.empty}>No assessments assigned yet. You will be notified in dashboard and email once scheduled.</p>
          ) : (
            <div className={styles.list}>
              {items.map((item) => (
                <div className={styles.item} key={item.id}>
                  <p className={styles.itemTitle}>{item.jobTitle}</p>
                  <p className={styles.itemSub}>{item.companyName}</p>
                  <p className={styles.itemMeta}>
                    {item.startTime
                      ? `Window: ${new Date(item.startTime).toLocaleString()} - ${new Date(item.endTime).toLocaleString()}`
                      : 'Assessment time not released by manager yet'}
                  </p>
                  <span className={styles.badge}>{item.status.replaceAll('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </UserLayout>
  );
};

export default UserAssessments;
