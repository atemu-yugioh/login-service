const { BadRequestError } = require('../core/error.response')
const { create, getApiKey } = require('../models/repositories/apiKey.repositories')
const { unGetInfoData } = require('../utils')

const UN_GET_FIELDS = ['isDisable', 'isDelete', 'isDefault', '__v']

class ApiKeyService {
  static create = async ({ key, permissions, createdBy }) => {
    const newApiKey = await create({ key, permissions, createdBy })

    return unGetInfoData({ object: newApiKey._doc, fields: UN_GET_FIELDS })
  }

  static getApiKey = async (key) => {
    const apiKeyFound = await getApiKey(key)

    if (!apiKeyFound) {
      throw new BadRequestError('Access denied. ApiKey not exist!!')
    }

    return unGetInfoData({ object: apiKeyFound, fields: UN_GET_FIELDS })
  }
}

module.exports = ApiKeyService
