const { CREATED } = require('../core/success.response')
const ApiKeyService = require('../services/apiKey.service')

class ApiKeyController {
  create = async (req, res, next) => {
    new CREATED({
      data: await ApiKeyService.create({ ...req.body })
    }).send(res)
  }
}

module.exports = new ApiKeyController()
