const apiKeyModel = require('../apiKey.model')
const crypto = require('crypto')

const create = async ({ permissions = ['create', 'read'], createdBy = 'admin' }) => {
  return apiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions,
    createdBy
  })
}

module.exports = {
  create
}
