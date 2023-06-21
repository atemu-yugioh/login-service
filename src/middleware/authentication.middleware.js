const { HEADER } = require('../configs/config.constant')
const { AuthFailureError } = require('../core/error.response')
const asyncHandler = require('../helper/asyncHandler')
const KeyTokenService = require('../services/keyToken.service')
const { verifyJWT } = require('../utils/auth')

const authentication = asyncHandler(async (req, res, next) => {
  // 1. check userId missing
  const userId = req.headers[HEADER.CLIENT_ID]

  if (!userId) {
    throw new AuthFailureError('Invalid Request')
  }

  // 2. check keyToken of user
  const keyToken = await KeyTokenService.findByUserId(userId)

  if (!keyToken) {
    throw new AuthFailureError('Invalid Request')
  }

  // 3. check refresh token
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]

      const decodeUser = await verifyJWT(refreshToken, keyToken.privateKey)

      if (!decodeUser) {
        throw new AuthFailureError('pls re-login')
      }

      // 4. check userId with keyToken match ??
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid User')
      }

      // 5. return next
      req.keyToken = keyToken
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw error
    }
  }

  // 3. access token
  const accessToken = req.headers[HEADER.AUTHORIZATION]

  const decodeUser = await verifyJWT(accessToken, keyToken.publicKey)

  // 4. check keyToken with userID is match ??
  if (!decodeUser) {
    throw new AuthFailureError('Token expired')
  }

  if (userId !== decodeUser.userId) {
    throw new AuthFailureError('Invalid user')
  }

  req.keyToken = keyToken
  req.user = decodeUser
  return next()
})

module.exports = {
  authentication
}
