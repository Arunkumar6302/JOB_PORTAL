# COMPLETE SETUP GUIDE - Job Posting Portal

## 🎯 Complete Step-by-Step Setup Instructions

### Prerequisites
- Node.js (v14+) - [Download](https://nodejs.org/)
- PostgreSQL (v12+) - [Download](https://www.postgresql.org/download/)
- Git (optional)

---

## 📦 Part 1: Backend Setup

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create PostgreSQL Database

Open PostgreSQL CLI (psql) and run:
```sql
-- Create database
CREATE DATABASE job_portal;

-- Connect to database
\c job_portal;

-- Then run the schema file (paste content of config/database.sql)
```

Or use command line:
```bash
psql -U postgres -d job_portal -f config/database.sql
```

### Step 4: Seed Test Data (Optional)

```bash
psql -U postgres -d job_portal -f config/seedData.sql
```

### Step 5: Configure Environment Variables

Create `.env` file in backend folder:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_super_secret_key_12345_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

⚠️ **IMPORTANT**: Replace `your_postgres_password` with your actual PostgreSQL password!

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Server is running on http://localhost:5000
```

---

## 🎨 Part 2: Frontend Setup

### Step 1: Navigate to Frontend (in NEW terminal)
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

You should see:
```
  VITE v4.4.5  ready in 234 ms

  ➜  Local:   http://localhost:3000
```

---

## ✅ Testing the Application

### 1. Open Browser
Go to: **http://localhost:3000**

You'll see the "HireHub" opening page with:
- App logo & tagline
- "Get Started" button
- "Login" & "Register" buttons

### 2. Register New Admin (Option A)
- Click **"Register"** button
- Fill in:
  - Name: `Admin User`
  - Email: `admin@test.com`
  - Password: `password123`
  - Confirm: `password123`
  - Role: `Admin` (only option)
- Click **"Register"**
- Redirected to login

### 3. Login (Option B - Using Seed Data)
- Click **"Login"** button
- Email: `admin@hirehub.com`
- Password: `admin123`
- Click **"Login"**

### 4. Enter OTP
- Check **Backend Console** for OTP code
- Example: `123456` (6-digit number)
- Paste in OTP field
- Click **"Verify OTP"**

### 5. Access Admin Dashboard ✅
You're now logged in! Navigate:
- **Dashboard** - View statistics
- **Companies** - Manage company approvals
- **Users** - Block/unblock users
- **Jobs** - View and delete jobs
- **Applications** - Update application status
- **Subscriptions** - View company payments
- **Settings** - Configure platform

---

## 🎮 Sample Actions to Test

### ✓ Company Management
1. Go to Companies section
2. See pending companies
3. Try: Approve, Reject, or Block
4. Status updates in real-time

### ✓ User Management
1. Go to Users section
2. See all registered users
3. Try: Block a user
4. Try: Unblock the user
5. Status updates

### ✓ Job Management
1. Go to Jobs section
2. See all job listings
3. Try: Close/Open a job
4. Try: Delete a job (with confirmation)

### ✓ View Statistics
1. Go to Dashboard
2. See:
   - Total Companies
   - Total Users
   - Total Jobs
   - Total Applications
   - Total Revenue

---

## 🔑 Default Test Credentials

If using seed data:
```
Email:    admin@hirehub.com
Password: admin123
```

Or create your own via registration.

---

## 📊 Database Structure

Your database now has 8 tables:
- users (admin accounts)
- companies (company info + status)
- jobs (job postings)
- applications (user applications)
- subscriptions (payment info)
- otp_verification (OTP records)
- settings (platform config)

---

## 🛠️ Common Issues & Solutions

### Issue: Backend won't start
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Port 5000 is busy. Change in `.env`:
```
PORT=5001
```

### Issue: Database connection error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: 
1. Start PostgreSQL server
2. Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
3. Ensure database exists: `psql -l`

### Issue: Frontend can't reach backend
```
Error: Network Error / Failed to fetch
```
**Solution**:
1. Ensure backend is running (check terminal)
2. Backend must be on port 5000
3. Check frontend API URL in `src/api.js`

### Issue: OTP not appearing
```
Where's the OTP code?
```
**Solution**:
1. Check backend console (where you ran `npm run dev`)
2. OTP is printed there for development
3. Look for: `📧 OTP sent to email@address: 123456`

### Issue: Styles not loading
```
Missing CSS / Ugly layout
```
**Solution**:
1. Hard refresh: `Ctrl+F5`
2. Clear cache: DevTools → Settings → Clear cache
3. Restart frontend server

---

## 🚀 Production Deployment Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Change DB_PASSWORD to secure value
- [ ] Set NODE_ENV=production
- [ ] Configure real email service for OTP
- [ ] Setup SSL/HTTPS
- [ ] Configure CORS for actual domain
- [ ] Run database backups
- [ ] Set up monitoring/logging
- [ ] Run `npm run build` for frontend

---

## 📚 File Structure Quick Reference

### Backend
```
backend/
├── config/database.js      ← DB connection
├── controllers/            ← Business logic
├── models/                 ← Database queries
├── routes/                 ← API endpoints
├── middleware/             ← Auth & errors
├── utils/                  ← Helpers
├── server.js              ← Main app
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/        ← React components
│   ├── context/           ← Global state
│   ├── pages/             ← Page components
│   ├── api.js             ← API calls
│   ├── index.css          ← Global styles
│   └── App.jsx            ← Router
├── public/                ← Static files
├── index.html
└── package.json
```

---

## 🎓 What You Now Have

✅ **Complete Admin Dashboard**
- Company management with approval workflow
- User management with blocking
- Job management with editing
- Application tracking
- Subscription viewing
- Settings configuration

✅ **Authentication System**
- Registration with validation
- Secure login with bcrypt
- OTP-based MFA
- JWT session tokens
- Automatic logout

✅ **Professional UI**
- Modern design inspired by major job platforms
- Responsive sidebar navigation
- Status badges with colors
- Loading states
- Error messages
- Table management

✅ **RESTful API**
- 30+ endpoints
- Proper error handling
- Input validation
- JWT authentication
- CORS enabled

✅ **PostgreSQL Database**
- 8 well-designed tables
- Indexes for performance
- Proper relationships
- Test data included

---

## 📞 Next Steps

1. **Customize**: Update colors, logos, company name
2. **Add Features**: Email notifications, charts, advanced filters
3. **Deploy**: Configure hosting (Heroku, AWS, etc.)
4. **Scale**: Add employer/employee dashboards
5. **Integrate**: Payment gateway, video interviews, etc.

---

## ❓ Frequently Asked Questions

**Q: Can I use this for production?**
A: Yes, but add HTTPS, real email service, and proper environment setup.

**Q: How do I add more features?**
A: Create controllers, models, routes in backend + components in frontend.

**Q: Can I change the color scheme?**
A: Yes, update CSS variables in `src/index.css`

**Q: How do I backup the database?**
A: Use `pg_dump job_portal > backup.sql`

**Q: Can multiple admins be created?**
A: Yes, but extend the registration to other roles first.

---

## 🎉 You're All Set!

Your complete job posting portal is now running! 

**Backend**: http://localhost:5000
**Frontend**: http://localhost:3000

Happy coding! 🚀
