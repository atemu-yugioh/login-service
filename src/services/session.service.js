const { create, findByUserIdAndDeviceId, deleteById } = require('../models/repositories/session.repositories')

class SessionService {
  static create = async ({ userId, publicKey, privateKey, refreshToken, deviceId, createdby, modifiedby }) => {
    const newSession = await create({ userId, publicKey, privateKey, refreshToken, deviceId, createdby, modifiedby })

    return newSession
  }

  static findByUserIdAndDeviceId = async (userId, deviceId) => {
    const sessionFound = await findByUserIdAndDeviceId(userId, deviceId)

    return sessionFound
  }

  static deleteById = async (id) => {
    return await deleteById(id)
  }
}

module.exports = SessionService
