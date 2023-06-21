const { findByUserId, removeKeyById } = require('../models/repositories/keyToken.repositories')

class KeyTokenService {
  static findByUserId = async (userId) => {
    return await findByUserId(userId)
  }

  static removeKeyById = async (id) => {
    return await removeKeyById(id)
  }
}

module.exports = KeyTokenService
