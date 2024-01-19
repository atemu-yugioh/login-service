const { HEADER } = require('../configs/constant.config')
const { CREATED, OK } = require('../core/success.response')
const ApiKeyService = require('../services/apiKey.service')

class ApiKeyController {
  create = async (req, res) => {
    new CREATED({
      message: 'Create apiKey success',
      data: await ApiKeyService.create({ ...req.body })
    }).send(res)
  }

  getDetail = async (req, res) => {
    new OK({
      message: 'ApiKey detail',
      data: await ApiKeyService.getApiKey(req.headers[HEADER.API_KEY]?.toString())
    }).send(res)
  }
}

module.exports = new ApiKeyController()
