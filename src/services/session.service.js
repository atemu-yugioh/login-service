const { create, findByUserIdAndSessionId, deleteById } = require('../models/repositories/session.repositories')

class SessionService {
  static create = async ({ userId, publicKey, privateKey, refreshToken, deviceId, createdBy, modifiedBy }) => {
    const newSession = await create({ userId, publicKey, privateKey, refreshToken, deviceId, createdBy, modifiedBy })

    return newSession
  }

  static findByUserIdAndDeviceId = async (userId, deviceId) => {
    const sessionFound = await findByUserIdAndSessionId(userId, deviceId)

    return sessionFound || null
  }
}

module.exports = SessionService
