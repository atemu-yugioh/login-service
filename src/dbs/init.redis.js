const { createClient } = require('redis')
const {
  dbRedis: { url }
} = require('../configs/app.config')

const redisClient = createClient({
  url
})

class RedisDB {
  constructor() {
    this.connect()
  }

  connect() {
    redisClient.on('ready', () => {
      console.log('ready for connection')
    })

    redisClient
      .connect()
      .then(() => console.log('Redis connected'))
      .catch((error) => console.log('Error::', error))
  }

  static getInstance() {
    if (!RedisDB.instance) {
      RedisDB.instance = new RedisDB()
    }

    return RedisDB.instance
  }
}

const instanceRedis = RedisDB.getInstance()

module.exports = {
  instanceRedis,
  redisClient
}
