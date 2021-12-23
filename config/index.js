const dotenv = require("dotenv");

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  /**
   * App Configuration
   */
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.PORT, 10),
  },

	/**
	 * JSON WEB TOKEN Configurations
	 */
   jwt: {
		iss: process.env.DOMAIN,
		secret: process.env.JWT_SECRET,
		round: 10,
	},

  /**
   * Display Configuration
   */
   display: {
    limits: 10,
  },

  /**
   * Redis Configuration
   */
   redisDB: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },

  /**
   * MariaDB Configuration
   */
   mariaDB: {
      username: process.env.MARIA_USERNAME,
      password: process.env.MARIA_PASSWORD,
      database: process.env.MARIA_DATABASE,
      port: process.env.MARIA_PORT,
      host: process.env.MARIA_HOST,
      dialect: process.env.MARIA_DIALECT
  },

  /**
   * Mongoose Configuration
   */
   mongoDB: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT || 27017,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
  },

  /**
   * Used by winston logger
   */
   logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

};
