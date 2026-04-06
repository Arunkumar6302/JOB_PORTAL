import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { dashboardAPI } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState({ jobsPerCompany: [], applicationsOverTime: [], usersGrowth: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getCharts(),
      ]);

      setStats(statsRes.data.data);
      setCharts(chartsRes.data.data);
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout currentPage="/admin/dashboard">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/dashboard">
      {error && <div className={styles.alert}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏢</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Companies</p>
            <p className={styles.statValue}>{stats?.totalCompanies || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👨‍💻</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Users</p>
            <p className={styles.statValue}>{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💼</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Jobs</p>
            <p className={styles.statValue}>{stats?.totalJobs || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📥</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Applications</p>
            <p className={styles.statValue}>{stats?.totalApplications || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Revenue</p>
            <p className={styles.statValue}>${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Jobs per Company</h3>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={charts.jobsPerCompany}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company_name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total_jobs" fill="#0066cc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Applications Over Time</h3>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={charts.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total_applications" stroke="#28a745" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>User Growth</h3>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={charts.usersGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total_users" stroke="#17a2b8" fill="#d1ecf1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
