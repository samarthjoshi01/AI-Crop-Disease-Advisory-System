const dns = require('dns');
const mongoose = require('mongoose');

// Use Google DNS (8.8.8.8) for SRV lookups — fixes ECONNREFUSED
// on ISPs (e.g. Jio/Reliance) that block MongoDB SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connect to MongoDB Atlas using the MONGO_URI environment variable.
 * Retries up to 5 times with increasing delays before exiting.
 */
const connectDB = async () => {
  const MAX_RETRIES = 5;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`   MongoDB     : Connected → ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`[DB ERROR] Attempt ${attempt}/${MAX_RETRIES}: ${error.message}`);

      if (attempt < MAX_RETRIES) {
        const delay = attempt * 5000; // 5s, 10s, 15s, 20s, 25s
        console.log(`   Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('[DB ERROR] All connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
