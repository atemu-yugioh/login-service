const { HEADERS } = require('../configs/config.constant')
const { ForbiddenError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const { getApiKey } = require('../models/repositories/apiKey.repositories')

const apiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[HEADERS.API_KEY]?.toString()

  if (!key) {
    throw new ForbiddenError('Access denied')
  }

  const objKey = await getApiKey(key)

  if (!objKey) {
    throw new ForbiddenError('Access denied')
  }

  req.objKey = objKey
  return next()
})

const permission = (permission) => {
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
