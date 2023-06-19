'use strict'

const { HEADER } = require('../configs/config.constant')
const { ForbiddenError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const ApiKeyService = require('../services/apiKey.service')

const apiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers[HEADER.API_KEY]?.toString()

  if (!apiKey) {
    throw new ForbiddenError('Access denied')
  }

  const objKey = await ApiKeyService.getApiKey(apiKey)

  req.objKey = objKey
  return next()
})

const permission = (permission) => {
  // gọi tới function permission truyền vào permission yêu cầu
  // và phải return về 1 middleware function của express (req, res, next) => {}
  return asyncHandler(async (req, res, next) => {
    const { permissions } = req.objKey

    if (!permissions.length) {
      throw new ForbiddenError('Permission denied')
    }

    if (!permissions.includes(permission)) {
      throw new ForbiddenError('Access denied')
    }

    return next()
  })
}

module.exports = {
  apiKey,
  permission
}
