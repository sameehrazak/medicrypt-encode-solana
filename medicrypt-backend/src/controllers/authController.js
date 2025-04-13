// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const { verifySignature } = require('../utils/solanaUtil');

// POST /auth/signup
// This endpoint registers a new user by collecting walletAddress, name, email, contact, and role.
exports.signup = async (req, res) => {
  const { walletAddress, name, email, contact, role } = req.body;
  if (!walletAddress || !name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields: walletAddress, name, email, or role' });
  }
  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Please log in.' });
    }
    // Create new user
    const user = await prisma.user.create({
      data: {
        walletAddress,
        name,
        email,
        contact: contact || null,
        role
      }
    });
    return res.status(201).json({ message: 'Signup successful', user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /auth/login
// This endpoint verifies the Phantom wallet signature and logs the user in.
exports.login = async (req, res) => {
  const { walletAddress, signature, message } = req.body;
  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: 'Missing walletAddress, signature, or message' });
  }

  // Verify the Phantom wallet signature
  const isValid = verifySignature(walletAddress, signature, message);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    // Look up the user by wallet address; user must already be registered.
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please signup first.' });
    }
    // Generate JWT token for authenticated sessions.
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /auth/me
// Retrieves the profile information of the currently authenticated user.
exports.getCurrentUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
