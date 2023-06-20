const crypto = require('crypto')
const apiKeyModel = require('../apiKey.model')

const createApiKey = async ({
  key = crypto.randomBytes(64).toString('hex'),
  permissions = ['auth'],
  createdBy = 'admin'
}) => {
  return await apiKeyModel
    .create({
      key: key,
      permissions,
      createdBy
    })
    .then((result) => {
      return result._doc
    })
}

const getApiKey = async (key, select = { key: 1, permissions: 1 }) => {
  return await apiKeyModel.findOne({ key }).select(select).lean()
}

module.exports = {
  createApiKey,
  getApiKey
}
