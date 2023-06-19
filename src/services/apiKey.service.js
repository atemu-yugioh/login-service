const { ForbiddenError } = require('../core/error.response')
const { createApiKey, getApiKey } = require('../models/repositories/apiKey.repositories')
const { getInfoData } = require('../utils')

class ApiKeyService {
  static createApiKey = async ({ permissions, createdBy }) => {
    const newKey = await createApiKey({ permissions, createdBy })

    return getInfoData({
      object: newKey._doc,
      fields: ['key', 'permissions']
    })
  }

  static getApiKey = async (key) => {
    const keyFound = await getApiKey(key)

    if (!keyFound) {
      throw new ForbiddenError('access denied')
    }

    return getInfoData({
      object: keyFound,
      fields: ['key', 'permissions']
    })
  }
}

module.exports = ApiKeyService
