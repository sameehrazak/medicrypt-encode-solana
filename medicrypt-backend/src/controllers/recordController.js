// src/controllers/recordController.js
const prisma = require('../prisma/client');

// GET /medical-records
exports.getRecords = async (req, res) => {
  const { userId, role } = req.user;
  try {
    let records;
    if (role === 'PATIENT') {
      records = await prisma.medicalRecord.findMany({
        where: { ownerId: userId }
      });
    } else {
      records = await prisma.medicalRecord.findMany();
    }
    return res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /medical-records/:id
exports.getRecordById = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  try {
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: { owner: true, accessRequests: true }
    });
    if (!record) return res.status(404).json({ error: 'Record not found' });

    if (role === 'PATIENT' && record.ownerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this record' });
    }
    return res.json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /medical-records
exports.createRecord = async (req, res) => {
  const { fileName, cid } = req.body;
  const userId = req.user.userId;
  if (!cid) return res.status(400).json({ error: 'CID is required' });

  try {
    const newRecord = await prisma.medicalRecord.create({
      data: {
        fileName: fileName || null,
        cid,
        ownerId: userId
      }
    });
    return res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
