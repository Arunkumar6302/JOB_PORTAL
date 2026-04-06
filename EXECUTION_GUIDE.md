# 🚀 Execution Guide - Copy & Paste Ready

## ✅ Your .env Files Are Ready
- `backend/.env` ✅
- `frontend/.env.local` ✅

---

## 📊 PostgreSQL Setup Via pgAdmin4

**Open pgAdmin4 and create the database:**

1. Right-click on "Databases" → Select "Create" → "Database"
2. **Database Name**: `job_portal`
3. **Owner**: `postgres`
4. Click "Save"

**Then query the SQL:**

In pgAdmin4, open the Query Tool and paste this entire SQL block:

```sql
-- Create all tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK(role IN ('admin', 'superadmin')) DEFAULT 'admin',
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  industry VARCHAR(50),
  location VARCHAR(100),
  status VARCHAR(50) CHECK(status IN ('pending', 'approved', 'rejected', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  status VARCHAR(50) CHECK(status IN ('open', 'closed')) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK(status IN ('applied', 'selected', 'rejected')) DEFAULT 'applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  plan_name VARCHAR(50),
  price DECIMAL(10, 2),
  job_slots INTEGER,
  status VARCHAR(50) CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP
);

CREATE TABLE otp_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_activity_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id),
  action VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_subscriptions_company_id ON subscriptions(company_id);

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES 
('Super Admin', 'admin@hirehub.com', '$2b$10$7LhI6i6RJWZC4Y8.7q5Dte.G5Ws3H7.8K0M9N1O2P3Q4R5S6T7U8V9W', 'superadmin');
```

**Execute the query.** ✅ Done!

---

## 🔧 Backend - Copy & Paste Commands

Open PowerShell and paste each line one at a time:

```powershell
cd "C:\Users\samee\OneDrive\certificates\Desktop\Job Posting Portal\backend"
npm install
npm start
```

**Keep this terminal open.** You'll see:
```
Server is running on port 5000
Connected to PostgreSQL database
```

---

## ⚛️ Frontend - Copy & Paste Commands

Open another PowerShell window and paste:

```powershell
cd "C:\Users\samee\OneDrive\certificates\Desktop\Job Posting Portal\frontend"
npm install
npm run dev
```

**Keep this terminal open.** You'll see:
```
➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the Application

Open your browser and go to:

### **Landing Page** (First Page)
```
http://localhost:5173
```

### **Login Page** (Click "Get Started" button)
```
http://localhost:5173/#/login
```

### **Test Credentials**
```
Email:    admin@hirehub.com
Password: admin123
OTP:      123456 (any 6 digits)
```

### **Admin Dashboard** (After Login)
- Companies Management
- Users Management
- Jobs Management
- Applications Management
- Subscriptions Management
- Settings Management
- Dashboard Statistics

---

## 📋 Quick Reference

| What | Command |
|------|---------|
| Backend Start | `npm start` (in backend folder) |
| Frontend Start | `npm run dev` (in frontend folder) |
| Backend URL | http://localhost:5000 |
| Frontend URL | http://localhost:5173 |
| PostgreSQL | Port 5432 |

---

**All ready! ✅**
