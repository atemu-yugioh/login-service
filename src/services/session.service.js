const {
  create,
  findByUserIdAndDeviceId,
  deleteById,
  deleteByUserId,
  saveToRefreshTokenUsed
} = require('../models/repositories/session.repositories')

class SessionService {
  static create = async ({ userId, publicKey, privateKey, refreshToken, deviceId, createdBy, modifiedBy }) => {
    const newSession = await create({ userId, publicKey, privateKey, refreshToken, deviceId, createdBy, modifiedBy })

    return newSession
  }

  static findByUserIdAndDeviceId = async (userId, deviceId) => {
    const sessionFound = await findByUserIdAndDeviceId(userId, deviceId)

    return sessionFound
  }

  static deleteById = async (id) => {
    return await deleteById(id)
  }

  static deleteByUserId = async (userId) => {
    return await deleteByUserId(userId)
  }

  static saveToRefreshTokenUsed = async (session) => {
    return await saveToRefreshTokenUsed(session)
  }
}

module.exports = SessionService
