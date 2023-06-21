const { findByUserId } = require('../models/repositories/keyToken.repositories')

class KeyTokenService {
  static findByUserId = async (userId) => {
    return await findByUserId(userId)
  }
}

module.exports = KeyTokenService
