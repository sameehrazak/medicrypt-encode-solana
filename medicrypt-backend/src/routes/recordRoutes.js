// src/routes/recordRoutes.js
const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

router.get('/', recordController.getRecords);
router.get('/:id', recordController.getRecordById);
router.post('/', recordController.createRecord);

module.exports = router;
