const ExpiredEventService = require('./expireEvent.service')
const redisPubSubService = require('./redisPubSub.service')

const patterns = ['__keyevent@0__:expired']

const objectHandleEvent = {
  '__keyevent@0__:expired': ExpiredEventService.handleExpiredEvent
}

class RedisSubEvent {
  constructor() {
    redisPubSubService.pSubscribe(patterns, (message, channel) => {
      RedisSubEvent.handlerEvent(channel, message)
    })
  }

  static handlerEvent = async (channel, message) => {
    return objectHandleEvent[channel](message)
  }
}

module.exports = new RedisSubEvent()
