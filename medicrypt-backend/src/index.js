// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes'); // This loads the combined routes

const app = express();

// Global Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount API Routes
app.use('/', routes);

// Start Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Medicrypt API server is running on port ${PORT}`);
});
