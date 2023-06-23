const {
  deleteByDeviceId,
  deleteKeyByUserId,
  findByUserIdAndDeviceId
} = require('../models/repositories/SessionToken.repositories')

class SessionTokenService {
  static findByUserIdAndDeviceId = async ({ userId, deviceId }) => {
    return await findByUserIdAndDeviceId({ userId, deviceId })
  }

  static removeDeviceId = async (id) => {
    return await removeDeviceId(id)
  }

  static deleteByDeviceId = async (deviceId) => {
    return await deleteByDeviceId(deviceId)
  }

  static deleteKeyByUserId = async (userId) => {
    return await deleteKeyByUserId(userId)
  }

  static updateRefreshTokenByUserId = ({ userId, refreshToken }) => {
    await
  }
}

module.exports = SessionTokenService
