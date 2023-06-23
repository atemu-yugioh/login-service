const { HEADER } = require('../configs/config.constant')
const { AuthFailureError, BadRequestError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const SessionTokenService = require('../services/SessionToken.service')
const { verifyJWT } = require('../utils/auth')

const authentication = asyncHandler(async (req, res, next) => {
  // 1. check userId missing
  const userId = req.headers[HEADER.CLIENT_ID]
  const deviceId = req.headers[HEADER.DEVICE_ID]

  if (!userId) {
    throw new AuthFailureError('Invalid Request')
  }

  if (!deviceId) {
    throw new AuthFailureError('Invalid Request')
  }

  // 2. check sessionToken of user
  const sessionToken = await SessionTokenService.findByUserIdAndDeviceId({ userId, deviceId })

  if (!sessionToken) {
    throw new AuthFailureError('Invalid Request')
  }

  // 3. check refresh token
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]

      const decodeUser = await verifyJWT(refreshToken, sessionToken.privateKey)

      if (!decodeUser) {
        throw new AuthFailureError('pls re-login')
      }

      // 4. check userId with SessionToken match ??
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid User')
      }

      // 4.1 check deviceId header and deviceId decode Token
      if (deviceId !== decodeUser.deviceId) {
        throw new AuthFailureError('Invalid Device')
      }

      // 5. return next
      req.sessionToken = sessionToken
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw error
    }
  }

  // 3. access token
  const accessToken = req.headers[HEADER.AUTHORIZATION]

  const decodeUser = await verifyJWT(accessToken, sessionToken.publicKey)

  // 4. check SessionToken with userID is match ??
  if (!decodeUser) {
    throw new AuthFailureError('Token expired')
  }

  if (userId !== decodeUser.userId) {
    throw new AuthFailureError('Invalid user')
  }

  // 4.1 check deviceId header and deviceId decode Token
  if (deviceId !== decodeUser.deviceId) {
    throw new AuthFailureError('Invalid Device')
  }

  req.sessionToken = sessionToken
  req.user = decodeUser
  return next()
})

const requireDeviceId = asyncHandler(async (req, res, next) => {
  const deviceId = req.headers[HEADER.DEVICE_ID]?.toString()

  if (!deviceId) {
    throw new BadRequestError('Device id required')
  }
  req.deviceId = deviceId
  return next()
})

module.exports = {
  authentication,
  requireDeviceId
}
