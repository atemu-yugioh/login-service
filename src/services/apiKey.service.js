const apiKeyRepositories = require('../models/respositories/apiKey.repositories')
const { getInfoData } = require('../utils')

class ApiKeyService {
  static create = async ({ permissions, createdBy }) => {
    const newKey = await apiKeyRepositories.create({ permissions, createdBy })

    return getInfoData({
      object: newKey._doc,
      fields: ['key', 'permissions']
    })
  }

  static findByKey = async (key) => {
    const keyFound = await apiKeyRepositories.findByKey(key)

    return getInfoData({
      object: keyFound,
      fields: ['key', 'permissions']
    })
  }
}

module.exports = ApiKeyService
