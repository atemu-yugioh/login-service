const { redisClient } = require('../../dbs/init.redis')

class RedisPubSubService {
  constructor() {
    this.publisher = redisClient.duplicate()
    this.subscriber = redisClient.duplicate()
    this.connect()
  }

  connect() {
    this.publisher
      .connect()
      .then(() => console.log('Publisher connected'))
      .catch((error) => console.log('Publisher fail'))

    this.subscriber
      .connect()
      .then(() => console.log('Subscriber connected'))
      .catch((error) => console.log('Subscriber fail'))
  }

  publish = async (channel, message) => {
    await this.publisher.publish(channel, message)
  }

  subscribe = async (channel, callback) => {
    await this.subscriber.subscribe(channel, (message, channel) => {
      callback(message, channel)
    })
  }

  pSubscribe = async (patterns, callback) => {
    await this.subscriber.pSubscribe(patterns, (message, channel) => callback(message, channel))
  }
}

module.exports = new RedisPubSubService()
