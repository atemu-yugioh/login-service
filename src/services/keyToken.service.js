const { findByUserId, removeKeyById, deleteKeyBuUserId } = require('../models/repositories/keyToken.repositories')

class KeyTokenService {
  static findByUserId = async (userId) => {
    return await findByUserId(userId)
  }

  static removeKeyById = async (id) => {
    return await removeKeyById(id)
  }

  static deleteKeyByUserId = async (userId) => {
    return await deleteKeyBuUserId(userId)
  }

  static updateRefreshTokenByUserId = ({ userId, refreshToken }) => {
    await
  }
}

module.exports = KeyTokenService
