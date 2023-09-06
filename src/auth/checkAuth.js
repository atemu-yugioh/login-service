const { HEADER } = require('../configs/constant.config')
const { ForbiddenError, BadRequestError } = require('../core/error.response')
const asyncHandler = require('../helpers/asyncHandler')
const ApiKeyService = require('../services/apiKey.service')

const requiredApiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString()

  if (!key) {
    throw new ForbiddenError('Access denied. ApiKey is required !!')
  }

  const objectKey = await ApiKeyService.getApiKey(key)

  if (!objectKey) {
    throw new ForbiddenError('Access denied. ApiKey not exist !!')
  }

  req.objectKey = objectKey

  return next()
})

const requiredDevice = asyncHandler(async (req, res, next) => {
  const deviceId = req.headers[HEADER.DEVICE_ID]?.toString()

  if (!deviceId) {
    throw new BadRequestError('Error: DeviceId is required !!!')
  }

  req.deviceId = deviceId
  return next()
})

const requiredPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    const { objectKey } = req

    if (!objectKey) {
      throw new ForbiddenError('Access denied. ApiKey is required!!')
    }

    if (!objectKey.permissions.includes(permission)) {
      throw new ForbiddenError('Access denied!!!')
    }

    return next()
  })
}

module.exports = {
  requiredApiKey,
  requiredDevice,
  requiredPermission
}
