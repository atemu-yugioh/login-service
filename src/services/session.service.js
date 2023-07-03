const { create } = require('../models/repositories/session.repositories')

class SessionService {
  static create = async ({ userId, publicKey, privateKey, refreshToken, deviceId, createdby, modifiedby }) => {
    const newSession = await create({ userId, publicKey, privateKey, refreshToken, deviceId, createdby, modifiedby })

    return newSession
  }
}

module.exports = SessionService
