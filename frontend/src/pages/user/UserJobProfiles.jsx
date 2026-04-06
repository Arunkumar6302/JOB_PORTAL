import React, { useEffect, useState } from 'react';
import { userPortalAPI } from '../../api';
import UserLayout from '../../components/user/UserLayout';
import styles from './UserJobProfiles.module.css';

const formatSalary = (min, max) => {
  if (!min && !max) {
    return 'Not disclosed';
  }

  if (min && max) {
    return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
  }

  return `$${Number(min || max).toLocaleString()}`;
};

const UserJobProfiles = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [applyingId, setApplyingId] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await userPortalAPI.getJobs();
      setJobs(response.data.data || []);
    } catch (err) {
      setError('Unable to fetch job profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    setError('');
    setInfo('');
    setApplyingId(jobId);

    try {
      await userPortalAPI.applyToJob(jobId);
      setInfo('Application submitted successfully.');
      setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, hasApplied: true } : job)));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to apply for this job');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <UserLayout currentPage="/user/job-profiles" pageTitle="Job Profiles">
      {error && <div className={styles.alertError}>{error}</div>}
      {info && <div className={styles.alertInfo}>{info}</div>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      ) : !jobs.length ? (
        <div className={styles.empty}>No open job profiles found right now.</div>
      ) : (
        <div className={styles.grid}>
          {jobs.map((job) => (
            <article className={styles.card} key={job.id}>
              <div className={styles.cardHeader}>
                <h3>{job.title}</h3>
                <span className={styles.badge}>{job.status}</span>
              </div>
              <p className={styles.company}>{job.company_name}</p>
              <p className={styles.desc}>{job.description || 'No description provided by company.'}</p>
              <div className={styles.meta}>
                <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                <p><strong>Salary:</strong> {formatSalary(job.salary_min, job.salary_max)}</p>
              </div>
              <button
                type="button"
                className={styles.applyBtn}
                onClick={() => handleApply(job.id)}
                disabled={job.hasApplied || applyingId === job.id}
              >
                {job.hasApplied ? 'Applied' : applyingId === job.id ? 'Applying...' : 'Apply Now'}
              </button>
            </article>
          ))}
        </div>
      )}
    </UserLayout>
  );
};

export default UserJobProfiles;
