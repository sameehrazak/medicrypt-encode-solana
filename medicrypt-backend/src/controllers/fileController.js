// src/controllers/fileController.js
const prisma = require('../prisma/client');
const { uploadFileToShadowDrive } = require('../services/shadowDriveService');

// POST /files
exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  try {
    const result = await uploadFileToShadowDrive(req.file);
    if (!result || !result.cid) {
      return res.status(500).json({ error: 'File upload to Shadow Drive failed' });
    }
    const fileEntry = await prisma.shdwFile.create({
      data: {
        cid: result.cid,
        fileName: req.file.originalname,
        uploaderId: req.user.userId
      }
    });
    return res.status(201).json({ file: fileEntry });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
