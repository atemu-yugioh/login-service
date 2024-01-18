const { TooManyRequestError } = require('../core/error.response')
const RedisService = require('../services/redis/redis.service')

const rateLimiter = (secondsLimit, limitAmount) => {
  return async (req, res, next) => {
    try {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      const numRequest = await RedisService.incr(ip)

      if (numRequest === 1) {
        await RedisService.expire(ip, secondsLimit)
      }

      if (numRequest > limitAmount) {
        throw new TooManyRequestError(`too many requests in ${secondsLimit}s. try again later`)
      }

      next()
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = {
  rateLimiter
}
