const { create } = require('../models/repositories/apiKey.repositories')

class ApiKeyService {
  static create = async ({ key, permissions, createdBy }) => {
    return await create({ key, permissions, createdBy })
  }
}

module.exports = ApiKeyService
