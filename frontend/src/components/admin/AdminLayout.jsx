import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI, userAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import styles from './AdminLayout.module.css';

const ROLE_LABELS = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  company_manager: 'Company Manager',
  user: 'User',
};

const normalizeRole = (role) => {
  if (role === 'admin') return 'admin';
  return role || 'user';
};

const getRoleLabel = (role) => ROLE_LABELS[role] || ROLE_LABELS.user;

const getInitials = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const renderHighlightedText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const query = searchTerm.trim();
  if (!query) return text;

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  return String(text).split(regex).map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return <mark key={`${part}-${index}`} className={styles.searchHighlight}>{part}</mark>;
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

const AdminLayout = ({ children, currentPage, pageTitle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const profileMenuRef = useRef(null);
  
  const [searchData, setSearchData] = useState({
    companies: [],
    users: [],
  });

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Openings', path: '/admin/openings', icon: '💼' },
    { name: 'Applications', path: '/admin/applications', icon: '📝' },
    { name: 'Companies', path: '/admin/companies', icon: '🏢' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: '💳' },
    { name: 'Logs', path: '/admin/logs', icon: '📜' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
    { name: 'My Profile', path: '/admin/profile', icon: '👤' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadSearchData = async () => {
      try {
        setSearchLoading(true);
        const [companiesRes, usersRes] = await Promise.all([
          companyAPI.getAll().catch(() => ({ data: { data: [] } })),
          userAPI.getAll().catch(() => ({ data: { data: [] } })),
        ]);

        if (isMounted) {
          setSearchData({
            companies: companiesRes.data.data || [],
            users: usersRes.data.data || [],
          });
        }
      } catch (error) {
        if (isMounted) setSearchData({ companies: [], users: [] });
      } finally {
        if (isMounted) setSearchLoading(false);
      }
    };
    loadSearchData();
    return () => { isMounted = false; };
  }, []);

  const groupedSearchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return { companies: [], users: [] };

    const matches = (items, fields, mapItem) => items
      .filter((item) => fields.some((field) => String(item[field] || '').toLowerCase().includes(query)))
      .slice(0, 5)
      .map(mapItem);

    return {
      companies: matches(searchData.companies, ['name', 'email'], (item) => ({
        id: item.id,
        label: item.name,
        meta: item.email || 'Company',
        route: `/admin/companies`,
      })),
      users: matches(searchData.users, ['name', 'email', 'role'], (item) => ({
        id: item.id,
        label: item.name,
        meta: `${getRoleLabel(item.role)} · ${item.email}`,
        route: '/admin/users',
      })),
    };
  }, [searchData, searchTerm]);

  const hasSearchResults = groupedSearchResults.companies.length || groupedSearchResults.users.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSelect = (route) => {
    setSearchTerm('');
    setSearchOpen(false);
    navigate(route);
  };

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoGroup}>
            <p className={styles.logo}>{sidebarOpen ? (settings?.platform_name || 'HireHub') : (settings?.platform_name?.[0] || 'H')}</p>
            {sidebarOpen && <p className={styles.logoSub}>Admin Portal</p>}
          </div>
          <button
            className={styles.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '❮' : '❯'}
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${currentPage === item.path ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.icon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.label}>{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className={styles.icon}>🚪</span>
            {sidebarOpen && <span className={styles.label}>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.mobileToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h2>{pageTitle || currentPage.split('/').pop().toUpperCase() || 'DASHBOARD'}</h2>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchWrap}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />

              {searchOpen && searchTerm.trim() && (
                <div className={styles.searchResults}>
                  {searchLoading ? (
                    <div className={styles.searchEmpty}>Loading...</div>
                  ) : hasSearchResults ? (
                    <>
                      {groupedSearchResults.companies.length > 0 && (
                        <div className={styles.searchGroup}>
                          <h4>Companies</h4>
                          {groupedSearchResults.companies.map((item) => (
                            <button key={`c-${item.id}`} className={styles.searchResult} onClick={() => handleSearchSelect(item.route)}>
                              <span className={styles.searchResultTitle}>{renderHighlightedText(item.label, searchTerm)}</span>
                              <span className={styles.searchResultMeta}>{item.meta}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {groupedSearchResults.users.length > 0 && (
                        <div className={styles.searchGroup}>
                          <h4>Users</h4>
                          {groupedSearchResults.users.map((item) => (
                            <button key={`u-${item.id}`} className={styles.searchResult} onClick={() => handleSearchSelect(item.route)}>
                              <span className={styles.searchResultTitle}>{renderHighlightedText(item.label, searchTerm)}</span>
                              <span className={styles.searchResultMeta}>{item.meta}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.searchEmpty}>No results</div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.profileMenuWrap} ref={profileMenuRef}>
              <button
                className={styles.profileAvatarBtn}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className={styles.profileAvatar}>{getInitials(user?.name)}</div>
              </button>

              {profileMenuOpen && (
                <div className={styles.profileMenu}>
                  <div className={styles.profileMenuHeader}>
                    <p>{user?.name}</p>
                    <small>{user?.email}</small>
                  </div>
                  <hr />
                  <button onClick={() => { setProfileMenuOpen(false); navigate('/admin/profile'); }}>My Profile</button>
                  <button onClick={handleLogout} className={styles.logoutMenuBtn}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
