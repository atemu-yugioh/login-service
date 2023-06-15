const { headers } = require('../constants/header.constant')
const { ForbiddenError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const ApiKeyService = require('../services/apiKey.service')

const apiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[headers.API_KEY]?.toString()

  if (!key) {
    throw new ForbiddenError('access denied')
  }

  // find apiKey
  const objKey = await ApiKeyService.findByKey(key)

  if (!objKey) {
    throw new ForbiddenError('access denied')
  }

  req.objKey = objKey
  next()
})

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions.length) {
      throw new ForbiddenError('access denied')
    }

    // check permission
    if (!req.objKey.permissions.includes(permission)) {
      throw new ForbiddenError('access denied')
    }

    return next()
  }
}

module.exports = {
  apiKey,
  permission
}
