const { createApiKey } = require('../models/repositories/apiKey.repositories')
const { getInfoData } = require('../utils')

class ApiKeyService {
  static create = async ({ key, permissions }) => {
    const newKey = await createApiKey({ key, permissions })

    return getInfoData({
      object: newKey,
      fields: ['key', 'permissions']
    })
  }
}

module.exports = ApiKeyService
