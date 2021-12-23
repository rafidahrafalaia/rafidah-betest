const config = require("../config");
const util = require("util");
const redis = require("redis");
module.exports = () => {
  const { host, port, password } = config.redisDB;
  try {
    let client = redis.createClient(`redis://${password}@${host}:${port}`);
    client.set = util.promisify(client.set);
    client.get = util.promisify(client.get);
    client.flushall = util.promisify(client.flushall);

    return client;
  } catch (e) {
    throw e;
  }
};
