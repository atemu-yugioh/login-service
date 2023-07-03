const { HEADER } = require('../configs/constant.config')
const { ForbiddenError, BadRequestError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const ApiKeyService = require('../services/apiKey.service')

const requiredApiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString()

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

const requiredDeviceId = asyncHandler(async (req, res, next) => {
  const deviceId = req.headers[HEADER.DEVICE_ID]

  if (!deviceId) {
    throw new BadRequestError('Error: DeviceId is required !!!')
  }

  req.deviceId = deviceId
  return next()
})

module.exports = {
  requiredApiKey,
  requiredPermission,
  requiredDeviceId
}
