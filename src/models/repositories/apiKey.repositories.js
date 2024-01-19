const crypto = require('crypto')
const apiKeyModel = require('../apiKey.model')

const create = async ({
  key = crypto.randomBytes(64).toString('hex'),
  permissions = ['auth'],
  createdBy = 'Admin',
  modifiedBy = 'Admin'
}) => {
  return apiKeyModel.create({ key, permissions, createdBy, modifiedBy })
}

const getApiKey = async (key) => {
  return apiKeyModel.findOne({ key }).lean()
}

module.exports = {
  create,
  getApiKey
}
