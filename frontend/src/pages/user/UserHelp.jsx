import React from 'react';
import UserLayout from '../../components/user/UserLayout';
import styles from './UserCommon.module.css';

const UserHelp = () => {
  return (
    <UserLayout currentPage="/user/help" pageTitle="Help">
      <section className={styles.card}>
        <h3>Support & Guidance</h3>
        <div className={styles.helpGrid}>
          <article className={styles.helpCard}>
            <h4>Profile Setup</h4>
            <p>Complete My Profile with education, experience, projects, and accomplishments before applying.</p>
          </article>
          <article className={styles.helpCard}>
            <h4>Job Apply Flow</h4>
            <p>Use Job Profiles section to apply. Track status in Home and Interviews/Assessments tabs.</p>
          </article>
          <article className={styles.helpCard}>
            <h4>Notifications</h4>
            <p>Shortlist and next-round updates appear in Home notifications. Email notifications can be enabled in next phase.</p>
          </article>
        </div>
      </section>
    </UserLayout>
  );
};

export default UserHelp;
