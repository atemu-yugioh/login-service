const { HEADERS } = require('../configs/config.constant')
const { AuthFailureError, ForbiddenError, BadRequestError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const KeyTokenService = require('../services/keyToken.service')
const { verifyJWT } = require('../utils/auth')

const authentication = asyncHandler(async (req, res, next) => {
  // check  userId and deviceId
  const userId = req.headers[HEADERS.CLIENT_ID]
  const deviceId = req.headers[HEADERS.DEVICE_ID]

  if (!userId) {
    throw new AuthFailureError('Invalid request')
  }

  if (!deviceId) {
    throw new AuthFailureError('Invalid request')
  }

  // Check keyToken (session device of user)
  const keyToken = await KeyTokenService.findByUserIdAdnDeviceId({ userId, deviceId })

  if (!keyToken) {
    throw new AuthFailureError('Request invalid')
  }

  // if refresh token sent check refreshToken truoc
  if (req.headers[HEADERS.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADERS.REFRESHTOKEN]?.toString()

    const decodeUser = await verifyJWT(refreshToken, keyToken.privateKey)

    if (!decodeUser) {
      throw new AuthFailureError('RefreshToken expired')
    }

    // check userId vs decodeUser.userId
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid request')
    }

    // check deviceId vs decode.uerId
    if (deviceId !== decodeUser.deviceId) {
      throw new AuthFailureError('Invalid request')
    }

    req.keyToken = keyToken
    req.user = decodeUser
    req.refreshToken = refreshToken

    return next()
  }

  // check token
  const accessToken = req.headers[HEADERS.AUTHORIZATION]?.toString()
  if (!accessToken) {
    throw new AuthFailureError('Access denied')
  }

  const decodeUser = await verifyJWT(accessToken, keyToken.publicKey)

  if (!decodeUser) {
    throw new AuthFailureError('AccessToken expired')
  }

  // check userId vs decodeUser.userId
  if (userId !== decodeUser.userId) {
    throw new AuthFailureError('Invald request')
  }

  // check deviceId vs decodeUser.deviceId
  if (deviceId !== decodeUser.deviceId) {
    console.log(deviceId)
    console.log(decodeUser.deviceId)
    throw new AuthFailureError('Invalid request')
  }

  req.keyToken = keyToken
  req.user = decodeUser

  return next()
})

const requiredDeviceId = asyncHandler(async (req, res, next) => {
  const deviceId = req.headers[HEADERS.DEVICE_ID]

  if (!deviceId) {
    throw new BadRequestError('Bad Request')
  }

  req.deviceId = deviceId

  return next()
})

module.exports = {
  authentication,
  requiredDeviceId
}
