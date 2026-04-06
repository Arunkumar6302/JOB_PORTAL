import React from 'react';
import UserLayout from '../../components/user/UserLayout';
import styles from './UserCommon.module.css';

const UserEvents = () => {
  return (
    <UserLayout currentPage="/user/events" pageTitle="Events">
      <section className={styles.card}>
        <h3>Career Events</h3>
        <ul className={styles.simpleList}>
          <li>Company webinars and virtual hiring drives will appear here.</li>
          <li>Once manager posts events, users can register and track participation.</li>
          <li>Upcoming integration: RSVP status and event reminders.</li>
        </ul>
      </section>
    </UserLayout>
  );
};

export default UserEvents;
