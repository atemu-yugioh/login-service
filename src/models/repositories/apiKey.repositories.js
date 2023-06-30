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

module.exports = {
  create
}
