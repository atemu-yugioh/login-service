const crypto = require('crypto')
const apiKeyModel = require('../apiKey.model')

const create = async ({
  key = crypto.randomBytes(64).toString('hex'),
  permissions = ['auth'],
  createdBy = 'Admin',
  modifiedBy = 'Admin'
}) => {
  return await apiKeyModel.create({ key, permissions, createdBy, modifiedBy })
}

const getByKey = async (key) => {
  return await apiKeyModel.findOne({ key }).lean()
}

module.exports = {
  create,
  getByKey
}
