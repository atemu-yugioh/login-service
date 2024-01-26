module.exports = {
  app: {
    port: 9999
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'loginDev'
  },
  dbRedis: {
    url: 'redis://localhost:6379'
  },
  nodeEnv: 'dev'
}
