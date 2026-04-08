import React, { useEffect, useMemo, useState } from 'react';
import { userAPI } from '../api';
import AdminLayout from '../components/admin/AdminLayout';
import styles from './Users.module.css';

const ROLE_LABELS = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  company_manager: 'Company Manager',
  user: 'User',
};

const normalizeRole = (role) => role || 'user';

const getRoleClass = (role) => {
  const normalized = normalizeRole(role);
  if (normalized === 'superadmin' || normalized === 'admin') return styles.roleSuperAdmin;
  if (normalized === 'company_manager' || normalized === 'manager') return styles.roleCompanyManager;
  return styles.roleUser;
};

const getRoleLabel = (role) => ROLE_LABELS[normalizeRole(role)] || ROLE_LABELS.user;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      fetchUsers({ silent: true });
    }, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchUsers = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await userAPI.getAll();
      const rows = res.data.data || [];
      // Filter out only if needed, but usually admin sees all. 
      // irfanhub version filtered out admins. I'll keep them but show them.
      setUsers(rows);
    } catch (err) {
      if (!silent) setError('Failed to load users');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    setActionLoading(userId);
    try {
      await userAPI.block(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: true } : u));
    } catch (err) {
      setError('Failed to block user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId) => {
    setActionLoading(userId);
    try {
      await userAPI.unblock(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: false } : u));
    } catch (err) {
      setError('Failed to unblock user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setActionLoading(userId);
    try {
      await userAPI.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = [u.name, u.email, getRoleLabel(u.role)]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const status = u.is_blocked ? 'blocked' : 'active';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getStatusBadge = (isBlocked) => (isBlocked ? styles.badgeBlocked : styles.badgeActive);

  if (loading) {
    return (
      <AdminLayout currentPage="/admin/users">
        <div className={styles.loading}><div className={styles.spinner}></div></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/users" pageTitle="User Management">
      {error && <div className={styles.alert}>{error}</div>}

      <div className={styles.filtersBar}>
        <div className={styles.filterGroup}>
          <label>Search</label>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Role</label>
          <select className={styles.select} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="company_manager">Company Manager</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>
          <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className={styles.empty}>No users found</td></tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`${styles.role} ${getRoleClass(u.role)}`}>{getRoleLabel(u.role)}</span></td>
                  <td><span className={`${styles.badge} ${getStatusBadge(u.is_blocked)}`}>{u.is_blocked ? 'Blocked' : 'Active'}</span></td>
                  <td className={styles.actions}>
                    {u.is_blocked ? (
                      <button className={styles.btnSuccess} onClick={() => handleUnblock(u.id)} disabled={actionLoading === u.id}>Unblock</button>
                    ) : (
                      <button className={styles.btnDanger} onClick={() => handleBlock(u.id)} disabled={actionLoading === u.id}>Block</button>
                    )}
                    <button
                      className={styles.btnDanger}
                      onClick={() => handleDelete(u.id)}
                      disabled={actionLoading === u.id}
                      style={{ marginLeft: '8px' }}
                    >
                      Delete
                    </button>
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

export default Users;
