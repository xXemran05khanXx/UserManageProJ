require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');

const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

// static frontend (for production builds served from root public)
app.use(express.static(path.join(__dirname, '..', 'public')));

// API
app.use('/api/users', usersRouter);

// If other /api/* endpoints are requested, return JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// serve frontend (index.html) for other routes (SPA)
app.get('*', (req, res, next) => {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next(err);
  });
});

// global error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/user_manage_pro';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    // Create HTTP server with increased maxHeaderSize to avoid 431 errors
    const server = http.createServer({ maxHeaderSize: 64 * 1024 }, app);
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
