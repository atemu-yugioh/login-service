require('dotenv').config()

const dev = {
  app: {
    port: process.env.DEV_PORT_APP || 9999
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.name || 'loginDev'
  },
  dbRedis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  nodeEnv: process.env.NODE_ENV || 'dev'
}

const pro = {
  app: {
    port: process.env.PORT_APP || 9999
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.name || 'loginDev'
  },
  dbRedis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  nodeEnv: process.env.NODE_ENV || 'pro'
}

const config = { dev, pro }

const env = process.env.NODE_ENV

module.exports = config[env]
