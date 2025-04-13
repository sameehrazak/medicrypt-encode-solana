// src/routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const fileController = require('../controllers/fileController');

const upload = multer(); // Using memory storage
router.post('/', upload.single('file'), fileController.uploadFile);

module.exports = router;
