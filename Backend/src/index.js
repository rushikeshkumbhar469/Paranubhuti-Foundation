const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

// Import routes
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables (override existing OS env variables like USERNAME)
dotenv.config({ override: true });

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed Default Admin Account
const seedAdmin = async () => {
  try {
    const adminUsername = process.env.Username || 'RSadmin';
    const adminPassword = process.env.Password || 'admin@paranubhuti';

    const adminExists = await Admin.findOne({ username: adminUsername });
    if (!adminExists) {
      // Admin model's pre-save hook will hash the password
      await Admin.create({
        username: adminUsername,
        password: adminPassword,
      });
      console.log(`Admin account seeded successfully with username: ${adminUsername}`);
    } else {
      console.log(`Admin account already exists: ${adminUsername}`);
    }
  } catch (error) {
    console.error(`Error seeding admin account: ${error.message}`);
  }
};

// Run admin seeding
seedAdmin();

// Mount Routes
app.use('/api', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.send('Paranubhuti Foundation API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
