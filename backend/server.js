const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const logRoutes = require('./routes/logRoutes');
const managerRoutes = require('./routes/managerRoutes');
const userPortalRoutes = require('./routes/userPortalRoutes');

const User = require('./models/User');
const { hashPassword } = require('./utils/authUtils');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/user-portal', userPortalRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler Middleware
app.use(errorHandler);

const ensureDemoUsers = async () => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const defaults = [
    { name: 'Irfan Demo User', email: 'irfanshaikmohammad1@gmail.com', password: 'User@123', role: 'user' },
    { name: 'Super Admin', email: 'admin@hirehub.com', password: 'Admin@123', role: 'admin' },
    { name: 'Hiring Manager', email: 'manager@hirehub.com', password: 'Manager@123', role: 'manager' }
  ];

  for (const item of defaults) {
    try {
      const existing = await User.findByEmail(item.email);
      if (existing) {
        continue;
      }
      const hashedPassword = await hashPassword(item.password);
      await User.create(item.name, item.email, hashedPassword, item.role);
      console.log(`Demo user created: ${item.email} / ${item.password}`);
    } catch (error) {
      console.error(`Unable to prepare demo user ${item.email}:`, error.message);
    }
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`\nServer is running on http://localhost:${PORT}\n`);
  await ensureDemoUsers();
});
