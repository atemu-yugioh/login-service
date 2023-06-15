const { SuccessResponse } = require('../core/success.response')
const ApiKeyService = require('../services/apiKey.service')

class ApiKeyController {
  create = async (req, res, next) => {
    new SuccessResponse({
      message: 'create api key for customer success',
      data: await ApiKeyService.create({ ...req.body })
    }).send(res)
  }

  getByKey = async (req, res, next) => {
    new SuccessResponse({
      message: 'success',
      data: await ApiKeyService.findByKey(req.params.key)
    }).send(res)
  }
}

module.exports = new ApiKeyController()
