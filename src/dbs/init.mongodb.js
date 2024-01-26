const mongoose = require('mongoose')

const {
  db: { host, port, name, url },
  nodeEnv
} = require('../configs/app.config')

const connectionString = url || `mongodb://${host}:${port}/${name}`

class MongoDB {
  constructor() {
    this.connect()
  }

  connect() {
    if (nodeEnv === 'dev') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectionString)
      .then(() => {
        console.log('Connected to mongodb')
      })
      .catch(() => {
        console.log('Unable connect to mongodb')
      })
  }

  static getInstance = () => {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB()
    }

    return MongoDB.instance
  }
}

const instanceMongoDB = MongoDB.getInstance()

module.exports = instanceMongoDB
