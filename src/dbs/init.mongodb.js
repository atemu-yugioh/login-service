const mongoose = require('mongoose')
const {
  db: { host, port, name }
} = require('../configs/app.config')

const connectionString = `mongodb://${host}:${port}/${name}`

class MongoDB {
  constructor() {
    this.connect()
  }

  connect() {
    if (1 === 1) {
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
