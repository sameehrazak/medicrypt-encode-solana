// src/routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const recordRoutes = require('./recordRoutes');
const accessRoutes = require('./accessRoutes');
const fileRoutes = require('./fileRoutes');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes for authentication.
router.use('/auth', authRoutes);

// Protected routes (JWT required).
router.use(authMiddleware.verifyToken);
router.use('/medical-records', recordRoutes);
router.use('/access-requests', accessRoutes);
router.use('/files', fileRoutes);

module.exports = router;
