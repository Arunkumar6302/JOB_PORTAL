import React, { useEffect, useState } from 'react';
import { userPortalAPI } from '../../api';
import UserLayout from '../../components/user/UserLayout';
import styles from './UserCommon.module.css';

const UserResume = () => {
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userPortalAPI.getProfile();
        setResumeUrl(response.data.data?.resumeUrl || '');
      } catch (err) {
        setResumeUrl('');
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserLayout currentPage="/user/resume" pageTitle="Resume">
      <section className={styles.card}>
        <h3>Resume</h3>
        {resumeUrl ? (
          <>
            <p className={styles.itemSub}>Resume URL from your profile:</p>
            <p className={styles.itemTitle}>{resumeUrl}</p>
          </>
        ) : (
          <p className={styles.empty}>
            Resume not added yet. Go to My Profile and set Resume URL to use it in job applications.
          </p>
        )}
      </section>
    </UserLayout>
  );
};

export default UserResume;
