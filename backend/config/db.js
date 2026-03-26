const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // In a real application, ensure MONGO_URI is set in .env
    // For this hackathon demo, we default to a local MongoDB instance if not present
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/autoflow');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
