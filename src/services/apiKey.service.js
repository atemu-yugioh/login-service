const { ForbiddenError } = require('../core/error.response')
const { create, getByKey } = require('../models/repositories/apiKey.repositories')
const { unGetInfoData } = require('../utils')

const unGetFields = ['isDisable', 'isDeleted', 'isDefault', '__v']
class ApiKeyService {
  static create = async ({ key, permissions, createdBy }) => {
    const newApiKey = await create({ key, permissions, createdBy })

    return unGetInfoData({ object: newApiKey._doc, fields: unGetFields })
  }

  static getByKey = async (key) => {
    const apiKeyFound = await getByKey(key)

    if (!apiKeyFound) {
      throw new ForbiddenError('Access denied. Api key not exist !!')
    }

    return unGetInfoData({ object: apiKeyFound, fields: unGetFields })
  }
}

module.exports = ApiKeyService
