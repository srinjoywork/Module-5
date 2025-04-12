const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Routes
const taskRoutes = require('./routes/task'); // Task Routes
const authRoutes = require('./routes/auth'); // Auth Routes

dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware
app.use(express.json());  // Use Express' built-in JSON parsing
app.use(express.static(path.join(__dirname, 'public')));

// CORS Settings
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Routes
app.use('/', taskRoutes);  // Routes for tasks (will be mapped to '/tasks')
app.use('/auth', authRoutes);   // Routes for authentication

// Centralized Error Handler
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Something went wrong';
  const data = error.data || null;
  res.status(status).json({ message, data });
});

// MongoDB Connection + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected!');
    app.listen(process.env.PORT || 8080, () => { // Default to 8080 if no PORT specified in env
      console.log(`Server running on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
