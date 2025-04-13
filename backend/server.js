// backend/server.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
// Configure dotenv
dotenv.config();
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // if you need to pass cookies
}));
const app = express();
const port = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Import route modules
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const researcherRoutes = require('./routes/researcher');
const ragRoutes = require('./routes/rag');

// Mount routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/researcher', researcherRoutes);
app.use('/api/rag', ragRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
