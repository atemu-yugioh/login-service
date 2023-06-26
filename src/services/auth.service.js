const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail, createUser, updatePassword } = require('../models/repositories/user.repositories')
const {
  createKeyToken,
  deleteByDeviceId,
  deleteByUserId,
  updateRefreshToken
} = require('../models/repositories/keyToken.repositories')
const { generateObjectMongodbId, getInfoData } = require('../utils')
const { hashedPassword, createHEXKey, createTokenPair, comparePassword } = require('../utils/auth')

class AuthService {
  static signUp = async ({ email, name, password, phone, roles, deviceId, ...other }) => {
    // check user exist
    const userFound = await findByEmail(email)

    if (userFound) {
      throw new BadRequestError('Error: User already registered!')
    }

    // hash password
    const passwordHashed = await hashedPassword(password)

    // generate new _id
    const id = generateObjectMongodbId()
    // create new user
    const newUser = await createUser({
      _id: id,
      email,
      name,
      phone,
      password: passwordHashed,
      roles,
      createdBy: id,
      modifiedBy: id,
      ...other
    })

    if (newUser) {
      // generate publicKey and privateKey
      const { publicKey, privateKey } = createHEXKey()

      // generate pair token
      const { accessToken, refreshToken } = await createTokenPair(
        { deviceId, userId: newUser._id, email },
        publicKey,
        privateKey
      )

      // create key store
      const newKeyToken = await createKeyToken({
        deviceId,
        userId: newUser._id,
        publicKey,
        privateKey,
        refreshToken,
        createdBy: newUser._id,
        modifiedBy: newUser._id
      })

      if (!newKeyToken) {
        throw new BadRequestError('Error: Can not create key token')
      }

      return {
        user: getInfoData({
          object: newUser,
          fields: ['email', 'name', 'phone', 'address', 'phone', 'avatar']
        }),
        token: {
          accessToken,
          refreshToken
        }
      }
    }
  }

  static login = async ({ deviceId, email, password }) => {
    // check user exist
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new BadRequestError('Error: User not registered!')
    }

    // compare password
    const isMath = await comparePassword(password, userFound.password)

    if (!isMath) {
      throw new BadRequestError('Error: password wrong')
    }

    // generate publicKey and privateKey
    const { publicKey, privateKey } = createHEXKey()

    // create pair token
    const { _id: userId } = userFound
    const { accessToken, refreshToken } = await createTokenPair(
      {
        deviceId,
        userId,
        email
      },
      publicKey,
      privateKey
    )

    // create keytoken
    const keyToken = await createKeyToken({
      deviceId,
      userId: userId,
      publicKey,
      privateKey,
      refreshToken,
      createdBy: userId,
      modifiedBy: userId
    })

    if (!keyToken) {
      throw new BadRequestError('Error: create key token fail')
    }

    return {
      user: getInfoData({
        object: userFound,
        fields: ['email', 'name', 'avatar', 'address', 'phone']
      }),
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  static logout = async (deviceId) => {
    return await deleteByDeviceId(deviceId)
  }

  static handleRefreshToken = async ({ user, keyToken, refreshToken }) => {
    const { userId, email } = user
    const { deviceId, publicKey, privateKey } = keyToken
    // checl exist user
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new BadRequestError('Error:: User not registered')
    }

    // check refesh token used
    if (keyToken.refreshTokenUsed.includes(refreshToken)) {
      // dekete all keyToken user => relogin
      await deleteByUserId(userId)
      throw new AuthFailureError('Something went wrong, pls login')
    }

    // check refreshToken vs refreshToken KeyToken
    if (refreshToken !== keyToken.refreshToken) {
      throw new AuthFailureError('Error:: Refresh Token invalid')
    }

    // create new pair token
    const { accessToken, refreshToken: newRefreshToken } = await createTokenPair(
      { deviceId, userId, email },
      publicKey,
      privateKey
    )

    // update refreshToken and refreshTokenUsed
    await updateRefreshToken({ userId, deviceId, refreshToken, newRefreshToken })
    // response
    return {
      user: user,
      token: {
        accessToken,
        refreshToken: newRefreshToken
      }
    }
  }

  static changePassword = async ({ keyToken, user, password, newPassword, confirmPassword }) => {
    if (!password || !newPassword || !confirmPassword) {
      throw new BadRequestError('Check at middlewares')
    }

    // check new pasword and confirm password
    if (newPassword !== confirmPassword) {
      throw new BadRequestError('Confirm password not match, chek at middleware')
    }

    // check user exist
    const { userId, email } = user
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new AuthFailureError('user not registered')
    }

    // check password
    const isMath = await comparePassword(password, userFound.password)

    if (!isMath) {
      throw new BadRequestError('old password incorret')
    }

    // hashed new password and update
    const newPasswordHashed = await hashedPassword(newPassword)

    // update password
    await updatePassword(userId, newPasswordHashed)

    // generate pair token
    const { deviceId, publicKey, privateKey } = keyToken
    const { accessToken, refreshToken } = await createTokenPair({ userId, email, deviceId }, publicKey, privateKey)

    return {
      user: user,
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }
}

module.exports = AuthService
