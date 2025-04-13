// src/controllers/accessController.js
const prisma = require('../prisma/client');

// POST /access-requests
exports.createAccessRequest = async (req, res) => {
  const { medicalRecordId } = req.body;
  const requesterId = req.user.userId;
  if (!medicalRecordId) return res.status(400).json({ error: 'medicalRecordId is required' });

  try {
    const request = await prisma.accessRequest.create({
      data: {
        medicalRecordId,
        requesterId,
        status: 'PENDING'
      }
    });
    return res.status(201).json(request);
  } catch (error) {
    console.error('Error creating access request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /access-requests
exports.getAccessRequests = async (req, res) => {
  const { userId, role } = req.user;
  try {
    let requests;
    if (role === 'PATIENT') {
      requests = await prisma.accessRequest.findMany({
        where: { medicalRecord: { ownerId: userId } },
        include: { medicalRecord: true, requester: true }
      });
    } else {
      requests = await prisma.accessRequest.findMany({
        where: { requesterId: userId },
        include: { medicalRecord: true }
      });
    }
    return res.json(requests);
  } catch (error) {
    console.error('Error fetching access requests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /access-requests/:id
exports.updateAccessRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.userId;
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const accessReq = await prisma.accessRequest.findUnique({
      where: { id },
      include: { medicalRecord: true }
    });
    if (!accessReq) return res.status(404).json({ error: 'Access request not found' });

    if (accessReq.medicalRecord.ownerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this request' });
    }
    const updatedRequest = await prisma.accessRequest.update({
      where: { id },
      data: { status }
    });
    return res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating access request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
