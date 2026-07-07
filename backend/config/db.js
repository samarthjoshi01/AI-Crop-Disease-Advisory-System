const dns = require('dns');
const mongoose = require('mongoose');

// Use Google DNS (8.8.8.8) for SRV lookups — fixes ECONNREFUSED
// on ISPs (e.g. Jio/Reliance) that block MongoDB SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connect to MongoDB Atlas using the MONGO_URI environment variable.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`   MongoDB     : Connected → ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB ERROR] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
