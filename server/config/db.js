const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = (process.env.MONGO_URI || '').trim();

  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    console.warn(`[Database Warning] MONGO_URI is missing or does not start with 'mongodb://' or 'mongodb+srv://'.`);
    console.warn(`[Database Warning] Server running in standalone mode. Set a valid MongoDB Atlas connection string in Render environment variables.`);
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    console.warn(`[Database Warning] Server will continue running for health checks.`);
  }
};

module.exports = connectDB;