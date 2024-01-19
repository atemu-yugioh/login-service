const { redisClient } = require('../../dbs/init.redis')

class RedisService {
  static setKey = async ({ key, value }) => {
    return redisClient.set(key, value)
  }

  static getKey = async (key) => {
    return redisClient.get(key)
  }

  static deleteKey = async (key) => {
    return redisClient.del(key)
  }

  static incr = async (key) => {
    return redisClient.incr(key)
  }

  static expire = async (key, time) => {
    return redisClient.expire(key, time)
  }

  static setEx = async ({ key, value, time }) => {
    return redisClient.setEx(key, time, value)
  }
}

module.exports = RedisService
