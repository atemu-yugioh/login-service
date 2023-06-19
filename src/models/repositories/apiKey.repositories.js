const apiKeyModel = require('../apiKey.model')
const crypto = require('crypto')

const defaultKey = crypto.randomBytes(64).toString('hex')

const createApiKey = async ({ permissions = ['auth'], createdBy = 'admin' }) => {
  return await apiKeyModel.create({ key: defaultKey, permissions, createdBy })
}

const getApiKey = async (key = '') => {
  return await apiKeyModel.findOne({ key }).lean()
}

module.exports = {
  createApiKey,
  getApiKey
}
