const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
  
  try {
    console.log(`[DB] Attempting connection to MongoDB at ${uri}...`);
    // Connect with a 3-second server selection timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] Successfully connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.warn(`[DB] Could not connect to external MongoDB (${err.message}).`);
    console.log(`[DB] Initializing embedded in-memory MongoDB fallback server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[DB] Successfully connected to In-Memory MongoDB at ${memUri}`);
    } catch (memErr) {
      console.error('[DB] Critical error initializing database fallback:', memErr);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };