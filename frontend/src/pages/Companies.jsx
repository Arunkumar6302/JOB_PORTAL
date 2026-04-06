import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import styles from './Companies.module.css';

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const fetchCompanies = async () => {
    try {
      const res = await companyAPI.getAll();
      setCompanies(res.data.data);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId) => {
    setActionLoading(companyId);
    try {
      await companyAPI.approve(companyId);
      setCompanies(companies.map(c => c.id === companyId ? { ...c, status: 'approved' } : c));
    } catch (err) {
      setError('Failed to approve company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (companyId) => {
    setActionLoading(companyId);
    try {
      await companyAPI.reject(companyId);
      setCompanies(companies.map(c => c.id === companyId ? { ...c, status: 'rejected' } : c));
    } catch (err) {
      setError('Failed to reject company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (companyId) => {
    setActionLoading(companyId);
    try {
      await companyAPI.block(companyId);
      setCompanies(companies.map(c => c.id === companyId ? { ...c, status: 'blocked' } : c));
    } catch (err) {
      setError('Failed to block company');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: styles.badgePending,
      approved: styles.badgeApproved,
      rejected: styles.badgeRejected,
      blocked: styles.badgeBlocked,
    };
    return badges[status] || '';
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = [company.name, company.owner_name, company.owner_email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, searchTerm, statusFilter]);

  if (loading) {
    return (
      <AdminLayout currentPage="/admin/companies">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/companies">
      {error && <div className={styles.alert}>{error}</div>}

      <div className={styles.filtersBar}>
        <div className={styles.filterGroup}>
          <label htmlFor="company-search">Search</label>
          <input
            id="company-search"
            type="text"
            className={styles.searchInput}
            placeholder="Search by company or owner name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="company-status">Status</label>
          <select
            id="company-status"
            className={styles.select}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <h3>Company Management</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Owner Name</th>
              <th>Owner Email</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.empty}>No companies found</td>
              </tr>
            ) : (
              filteredCompanies.map(company => (
                <tr
                  key={company.id}
                  className={styles.clickableRow}
                  onClick={() => navigate(`/admin/company/${company.id}`)}
                >
                  <td>{company.name}</td>
                  <td>{company.owner_name || 'N/A'}</td>
                  <td>{company.owner_email}</td>
                  <td>{formatDate(company.created_at)}</td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadge(company.status)}`}>
                      {company.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
                      {company.status === 'pending' && (
                        <>
                          <button
                            className={styles.btnSuccess}
                            onClick={() => handleApprove(company.id)}
                            disabled={actionLoading === company.id}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className={styles.btnDanger}
                            onClick={() => handleReject(company.id)}
                            disabled={actionLoading === company.id}
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}
                      {company.status !== 'blocked' && (
                        <button
                          className={styles.btnWarning}
                          onClick={() => handleBlock(company.id)}
                          disabled={actionLoading === company.id}
                        >
                          🚫 Block
                        </button>
                      )}
                    </div>
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

export default Companies;
