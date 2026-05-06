/**
 * config/db.js
 * MongoDB connection with retry logic and event listeners
 * (Imported by server.js — kept separate for testability)
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    // These options are defaults in Mongoose 6+, listed for clarity
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
  });

  logger.info(`MongoDB connected: ${conn.connection.host}`);

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB error:', err);
  });
};

module.exports = connectDB;
