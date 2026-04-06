import React from 'react';
import UserLayout from '../../components/user/UserLayout';
import styles from './UserCommon.module.css';

const UserCompetitions = () => {
  return (
    <UserLayout currentPage="/user/competitions" pageTitle="Competitions">
      <section className={styles.card}>
        <h3>Competitions</h3>
        <ul className={styles.simpleList}>
          <li>Hackathons and coding competitions can be listed here.</li>
          <li>Scoreboards and participation updates can be integrated with manager module.</li>
          <li>User achievements from competitions can also be synced to profile accomplishments.</li>
        </ul>
      </section>
    </UserLayout>
  );
};

export default UserCompetitions;
