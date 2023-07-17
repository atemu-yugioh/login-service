require('dotenv').config()

const dev = {
  app: {
    port: process.env.DEV_PORT_APP || 9999
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 9999,
    name: process.env.DEV_DDB_NAME || 'authDev'
  },
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    channel: process.env.DISCORD_CHANNEL || ''
  }
}

const pro = {
  app: {
    port: process.env.PORT_APP || 9999
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 9999,
    name: process.env.DDB_NAME || 'authPro'
  },
  discord: {
    token: process.env.DISCORD_TOKEN || ''
  }
}

const env = process.env.NODE_ENV

const config = { dev, pro }

module.exports = config[env]
