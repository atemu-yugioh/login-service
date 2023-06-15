const mongoose = require('mongoose')
const {
  db: { host, port, name }
} = require('../configs/config.mongodb')

const connectionString = `mongodb://${host}:${port}/${name}`
class Database {
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
      .then((_) => {
        console.log('Connect databse success')
      })
      .catch((error) => {
        console.log('Unable connect to database')
      })
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
