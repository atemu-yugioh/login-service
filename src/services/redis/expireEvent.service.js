const { deleteById } = require('../../models/repositories/session.repositories')

class ExpiredEventService {
  static handleExpiredEvent = async (message) => {
    const listStr = message.split(':')
    if (listStr[0] === 'sessionInvalid') {
      const sessionId = listStr[listStr.length - 1]
      await deleteById(sessionId)
    }
  }
}

module.exports = ExpiredEventService
