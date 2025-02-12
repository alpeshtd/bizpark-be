const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const appRoutes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');

require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/', authMiddleware, appRoutes);

app.use(errorHandler);

module.exports = app;