const { findByUserIdAdnDeviceId } = require('../models/repositories/keyToken.repositories')

class KeyTokenService {
  static findByUserIdAdnDeviceId = async ({ userId, deviceId }) => {
    return await findByUserIdAdnDeviceId({ userId, deviceId })
  }
}

module.exports = KeyTokenService
