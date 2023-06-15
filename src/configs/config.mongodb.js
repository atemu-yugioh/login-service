require('dotenv').config()

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 9999
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'loginDev'
  }
}

const pro = {
  app: {
    port: process.env.APP_PORT || 9999
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'loginPro'
  }
}

const configs = { dev, pro }

const env = process.env.NODE_ENV

module.exports = configs[env]
