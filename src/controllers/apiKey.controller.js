const { OK, SuccessResponse } = require('../core/success.response')
const ApiKeyService = require('../services/apiKey.service')

class ApiKeyController {
  createKey = async (req, res, next) => {
    new OK({
      data: await ApiKeyService.createApiKey({ ...req.body })
    }).send(res)
  }

  getKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key']

    new SuccessResponse({
      message: 'get key success',
      data: await ApiKeyService.getApiKey(apiKey)
    }).send(res)
  }
}

module.exports = new ApiKeyController()
