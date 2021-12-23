const mongoose = require("mongoose");

const config = require("../config");
module.exports = async () => {
  const { username, password, host, port, database } = config.mongoDB;
  try {
    // mongoose.set("debug", true);
    await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}`, {
      dbName: database,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    throw e;
  }
};
