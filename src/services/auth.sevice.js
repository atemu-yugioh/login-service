const { BadRequestError, AuthFailureError } = require('../core/error.response')
const authRepositories = require('../models/repositories/user.repositories')
const sessionTokenRepositories = require('../models/repositories/sessionToken.repositories')
const { newMongoObjectId, getInfoData } = require('../utils')
const { hashPassword, createHEXKey, createTokenPair } = require('../utils/auth')
const { isMatchPassword } = require('../utils/auth')
const SessionTokenService = require('./SessionToken.service')
const UserService = require('./user.service')

class AuthService {
  constructor() {}

  // Sign up
  static SignUp = async ({ email, name, password, phone, roles = ['user'], ...other }) => {
    // check user exist
    const userFound = await authRepositories.findByEmail(email)

    if (userFound) {
      throw new BadRequestError('Email already registered!')
    }

    const passwordHashed = await hashPassword(password)

    // create new User
    const id = newMongoObjectId()
    const newUser = await authRepositories.createUser({
      _id: id,
      email,
      name,
      password: passwordHashed,
      phone: phone,
      roles,
      createdBy: id,
      modifiedBy: id,
      ...other
    })

    if (newUser) {
      // generate HEX key
      const { privateKey, publicKey } = createHEXKey()

      // create pair token
      const { _id: userId } = newUser
      const { accessToken, refreshToken } = await createTokenPair(
        {
          userId: userId,
          email
        },
        publicKey,
        privateKey
      )

      // save SessionToken
      const sessionToken = await sessionTokenRepositories.createSessionToken({
        userId: userId,
        publicKey,
        privateKey,
        refreshToken: refreshToken,
        createdBy: userId,
        modifiedBy: userId
      })

      if (!sessionToken) {
        throw new BadRequestError('Error:: SessionToken Error')
      }

      return {
        user: getInfoData({
          object: newUser._doc,
          fields: ['_id', 'name', 'email']
        }),
        tokens: {
          accessToken,
          refreshToken
        }
      }
    }
  }

  // Login
  static login = async ({ email, password }) => {
    // check user exist
    const userFound = await authRepositories.findByEmail(email)

    if (!userFound) {
      throw new BadRequestError('Error: User not registered')
    }

    const isMath = isMatchPassword(password, userFound.password)

    if (!isMath) {
      throw new BadRequestError('Error: Password invalid')
    }

    // generate publicKey and privateKey
    const { publicKey, privateKey } = createHEXKey()

    // generate token pair
    const { _id: userId } = userFound
    const { accessToken, refreshToken } = await createTokenPair({ userId: userId, email }, publicKey, privateKey)

    // create or update sessionToken
    const sessionToken = await sessionTokenRepositories.createSessionToken({
      userId,
      publicKey,
      privateKey,
      refreshToken,
      createdBy: userId,
      modifiedBy: userId
    })

    if (!sessionToken) {
      throw new BadRequestError('Error: SessionToken Error')
    }

    return {
      user: getInfoData({
        object: userFound,
        fields: ['email', 'name', 'phone', 'address', 'avatar']
      }),
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  // logout
  static logout = async (sessionToken) => {
    // remove all SessionToken
    const delKey = await SessionTokenService.removeKeyById(sessionToken._id)

    return delKey
  }

  // handle refresh token
  static handleRefreshToken = async ({ user, sessionToken, refreshToken }) => {
    const { userId, email } = user
    // check refresh token da duoc su dung chua
    if (sessionToken.refreshTokenUsed.includes(refreshToken)) {
      // xoa tat ca sessionToken cua user => nguoi dung se phai login lai
      await SessionTokenService.deleteKeyByUserId(userId)
      throw new AuthFailureError('Something went wrong happen !! Pls re-login')
    }

    // check refresh token match
    if (sessionToken.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered')
    }

    // check user exist
    const userFound = await UserService.findByEmail(email)

    if (!userFound) {
      throw new AuthFailureError('User not registered')
    }

    const { publicKey, privateKey } = sessionToken
    // generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )

    // update token
    await sessionTokenRepositories.updateRefreshTokenByUserId({ userId, refreshToken, newRefreshToken })

    return {
      user: { userId, email },
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    }
  }
}

module.exports = AuthService
