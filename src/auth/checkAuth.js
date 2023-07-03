const { HEADER } = require('../configs/constant.config')
const { ForbiddenError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const ApiKeyService = require('../services/apiKey.service')

const requiredApiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[HEADER.X_API_KEY]?.toString()

  if (!key) {
    throw new ForbiddenError('Access denied. Api key is required !!')
  }

  // find apikey
  const objKey = await ApiKeyService.getByKey(key)

  req.objKey = objKey
  return next()
})

const requiredPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    const { objKey } = req

    if (!objKey) {
      throw new ForbiddenError('Access denied. Api key not exist !!')
    }

    if (!objKey.permissions.includes(permission)) {
      throw new ForbiddenError('Access Denied !!!')
    }

    return next()
  })
}

module.exports = {
  requiredApiKey,
  requiredPermission
}
