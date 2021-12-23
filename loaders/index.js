const expressLoader = require('./express');
const logger = require('./logger');
const mongoose = require('./mongoose');

module.exports = async app => {
   // LOAD ROUTES
   await expressLoader(app);
   logger.info('✌️ Express loaded');
   
   // LOAD MONGOOSE
   await mongoose();
};
