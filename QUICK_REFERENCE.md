# Quick Reference Guide

## 🚀 Start Application (30 seconds)

### Terminal 1 - Backend
```bash
cd backend
npm install          # Skip if already done
npm run dev          # Starts on port 5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install          # Skip if already done
npm run dev          # Starts on port 3000
```

Open: **http://localhost:3000**

---

## 🔐 Login Credentials

```
Email:    admin@hirehub.com
Password: admin123
OTP:      Check backend console (6 digits)
```

---

## 📝 File Locations

| What | Where |
|------|-------|
| Backend API | `backend/routes/` |
| Backend Logic | `backend/controllers/` |
| DB Queries | `backend/models/` |
| React Components | `frontend/src/components/` |
| Admin Pages | `frontend/src/pages/` |
| Global Styles | `frontend/src/index.css` |
| API Client | `frontend/src/api.js` |
| Router | `frontend/src/App.jsx` |

---

## 🔌 Add New API Endpoint

### Backend (3 steps)

1. **Controller** (`backend/controllers/`)
```js
const newAction = async (req, res) => {
  try {
    // Your logic
    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

2. **Route** (`backend/routes/`)
```js
router.get('/endpoint', authenticateAdmin, newAction);
```

3. **Call from Frontend**
```js
// In frontend/src/api.js
export const yourAPI = {
  getAction: () => api.get('/endpoint'),
};
```

---

## 🎨 Change Colors

Edit `frontend/src/index.css`:
```css
:root {
  --primary-color: #0066cc;      /* Change blue */
  --danger-color: #dc3545;       /* Change red */
  --success-color: #28a745;      /* Change green */
  /* ... more colors ... */
}
```

---

## 📊 Database Queries

### Add Data
```sql
INSERT INTO users (name, email, password, role)
VALUES ('Name', 'email@test.com', 'hashed_password', 'admin');
```

### View Data
```sql
SELECT * FROM users;
SELECT * FROM companies WHERE status = 'pending';
```

### Update Data
```sql
UPDATE companies SET status = 'approved' WHERE id = 1;
```

---

## 🐛 Debug

### Backend Logs
- Check terminal where `npm run dev` is running
- OTP printed there
- Error messages visible

### Frontend Logs
- Open DevTools (F12)
- Check Console tab
- Look for API errors
- Check Network tab for requests

---

## 🔍 Common Ports

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | (local connection) |

---

## 💾 Backup Database

```bash
pg_dump job_portal > backup.sql
# Restore:
psql job_portal < backup.sql
```

---

## 📦 Install New Package

### Backend
```bash
cd backend
npm install package-name
```

### Frontend
```bash
cd frontend
npm install package-name
```

---

## 🧹 Clean Install

### Backend
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Build for Production

### Frontend
```bash
cd frontend
npm run build
# Creates 'dist' folder - ready to deploy
```

---

## 📋 Admin Passwords DEFAULT

All test users use password: `admin123` (hashed in DB)

---

## 🔑 Route Protection

### Protected (require login)
- /admin/dashboard
- /admin/companies
- /admin/users
- /admin/jobs
- /admin/applications
- /admin/subscriptions
- /admin/settings

### Public (no login needed)
- / (home)
- /login
- /register
- /verify-otp

---

## 🎯 Common Tasks

### Delete User
```sql
DELETE FROM users WHERE id = 5;
```

### Reset Password (after)
```sql
UPDATE users SET password = 'new_hashed_password' WHERE id = 1;
```

### Export Data
```bash
# Export users to CSV
\copy (SELECT * FROM users) TO 'users.csv' WITH CSV HEADER;
```

---

## 📱 Mobile Testing

Frontend is responsive. Test on:
- Desktop (full featured)
- Tablet (sidebar collapses)
- Mobile (hamburger menu)

---

## 🔄 Restart Services

### Quick Restart
```bash
# Terminal 1: Ctrl+C then npm run dev
# Terminal 2: Ctrl+C then npm run dev
```

---

## ⚡ Performance Tips

1. **Database**: Queries have proper indexes
2. **Frontend**: CSS Modules prevent conflicts
3. **API**: JWT tokens reduce DB queries
4. **Caching**: localStorage for user data

---

## 📚 File Size Reference

- Backend code: ~2000 lines
- Frontend code: ~3000 lines
- Database schema: ~200 lines
- Total: ~5000+ lines of production code

---

## 🎓 Learning Resources

- **Node/Express**: expressjs.com
- **React**: react.dev
- **PostgreSQL**: postgresql.org/docs
- **Vite**: vitejs.dev
- **JWT**: jwt.io

---

## ✅ Checklist Before Deployment

- [ ] Change JWT_SECRET in backend/.env
- [ ] Change DB_PASSWORD in backend/.env
- [ ] Set NODE_ENV=production
- [ ] Configure real email for OTP
- [ ] Setup HTTPS
- [ ] Test all admin functions
- [ ] Backup database
- [ ] Create admin account
- [ ] Run `npm run build` for frontend

---

## 🆘 Emergency Fixes

### Port stuck?
```bash
# Find process on port
lsof -i :5000
# Kill it
kill -9 <PID>
```

### Database locked?
```sql
-- Kill all connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'job_portal' AND pid <> pg_backend_pid();
```

### Styles broken?
```bash
# Frontend
Ctrl+Shift+Delete (clear cache)
npm run dev (restart)
```

---

## 📞 Support Checklist

Before asking for help:
1. Check backend terminal for errors
2. Check browser console (F12)
3. Verify .env file exists
4. Ensure PostgreSQL running
5. Restart services
6. Clear cache and reload

---

**Remember**: All files are well-documented. When in doubt, check the code comments!
