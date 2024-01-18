const { redisClient } = require('../../dbs/init.redis')

class RedisService {
  static setKey = async ({ key, value }) => {
    return await redisClient.set(key, value)
  }

  static getKey = async (key) => {
    return await redisClient.get(key)
  }

  static incr = async (key) => {
    return await redisClient.incr(key)
  }

  static expire = async (key, time) => {
    return await redisClient.expire(key, time)
  }

  static setEx = async ({ key, value, time }) => {
    return await redisClient.setEx(key, time, value)
  }
}

module.exports = RedisService
