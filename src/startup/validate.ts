module.exports = (config) => {
  if (!config.port) {
    throw new Error('FATAL ERROR: APP_PORT is not defined');
  }

  if (!config.mongoDb) {
    throw new Error('FATAL ERROR: mongoDb is not defined');
  }
  if (!config.mongoDb.host) {
    throw new Error('FATAL ERROR: MONGO_HOST is not defined');
  }
  if (!config.mongoDb.database) {
    throw new Error('FATAL ERROR: MONGO_DB is not defined');
  }
  if (!config.mongoDb.port) {
    throw new Error('FATAL ERROR: MONGO_PORT is not defined');
  }

  if (!config.jwt.expiry) {
    throw new Error('FATAL ERROR: TOKEN_EXPIRES_IN is not defined');
  }
  if (!config.jwt.expiry) {
    throw new Error('FATAL ERROR: TOKEN_EXPIRES_IN is not defined');
  }
};
