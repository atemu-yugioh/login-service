const { BadRequestError, AuthFailError } = require('../core/error.response')
const { findByEmail, create, findById } = require('../models/repositories/user.repositories')
const sessionRepo = require('../models/repositories/session.repositories')
const { hashPassword, createHexKey, createPairToken, comparePassword } = require('../utils/auth.utils')
const { getInfoData, generateObjectMongodbId } = require('../utils')

const selectFields = ['name', 'email', 'phone', 'address', 'birthDay', 'avatar']
class AuthService {
  static signUp = async ({ name, email, password, phone, deviceId, ...other }) => {
    // check exist user
    const userFound = await findByEmail(email)

    if (userFound) {
      throw new BadRequestError('Email already registered!!')
    }

    // hashed password
    const passwordHash = await hashPassword(password)

    // create new user
    const _id = generateObjectMongodbId()
    const newUser = await create({
      _id,
      name,
      password: passwordHash,
      email,
      phone,
      createdBy: _id,
      modifiedBy: _id,
      ...other
    })

    // create success
    if (newUser._doc) {
      // create public key and private key
      const { publicKey, privateKey } = createHexKey()

      // generate accessToken and refreshToken
      const { accessToken, refreshToken } = await createPairToken(
        { userId: _id, email, deviceId },
        publicKey,
        privateKey
      )

      // save session to tracking
      const newSession = await sessionRepo.create({
        userId: _id,
        publicKey,
        privateKey,
        refreshToken,
        deviceId,
        createdBy: _id,
        modifiedBy: _id
      })

      if (!newSession) {
        throw new BadRequestError('Error:: Session fail')
      }

      return {
        token: {
          accessToken,
          refreshToken
        },
        user: getInfoData({
          object: newUser._doc,
          fields: selectFields
        })
      }
    }
  }

  static login = async ({ deviceId, email, password }) => {
    // check user exist
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new BadRequestError('Error:: email not registered')
    }

    // compare password
    const isMatch = await comparePassword(password, userFound.password)

    if (!isMatch) {
      throw new BadRequestError('Error:: password invalid!!')
    }

    // create publicKey and privateKey
    const { publicKey, privateKey } = createHexKey()

    // create accessToken and refreshToken
    const userId = userFound._id
    const { accessToken, refreshToken } = await createPairToken({ userId, email, deviceId }, publicKey, privateKey)

    // create new session
    const newSession = await sessionRepo.create({
      userId,
      publicKey,
      privateKey,
      refreshToken,
      deviceId,
      createdBy: userId,
      modifiedBy: userId
    })

    if (!newSession) {
      throw new BadRequestError('Error:: Session fail')
    }

    return {
      token: {
        accessToken,
        refreshToken
      },
      user: getInfoData({ object: userFound, fields: selectFields })
    }
  }

  static logout = async (session) => {
    return await sessionRepo.deleteById(session._id)
  }

  static handleRefreshToken = async ({ user, session, refreshToken }) => {
    const { userId, email, deviceId } = user
    const { publicKey, privateKey, refreshToken: refreshTokenStore, refreshTokenUsed } = session

    // check refreshToken  === refreshTokenStore
    if (refreshToken !== refreshTokenStore) {
      throw new AuthFailError('RefreshToken invalid,pls re-login')
    }

    // check user exist
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new AuthFailError('User invalid, pls re-login')
    }

    // check refresh token used ??
    if (refreshTokenUsed.includes(refreshToken)) {
      // đã có người dùng refreshToken này để lấy lại token mới rồi
      // login lại cho an toàn => nếu đúng là người dùng thật thì sẽ login lại được thôi
      await sessionRepo.deleteByUserId(userId)
      throw new AuthFailError('Something went wrong, pls login')
    }

    // create pair token
    const token = await createPairToken(user, publicKey, privateKey)

    // push refreshToken to refreshTokenUsed
    await sessionRepo.saveToRefreshTokenUsed({ ...session, newRefreshToken: token.refreshToken })

    return {
      token,
      user: getInfoData({
        object: userFound,
        fields: selectFields
      })
    }
  }

  static findById = async (id) => {
    const userFound = await findById(id)

    return userFound ? getInfoData({ object: userFound, fields: selectFields }) : null
  }
}

module.exports = AuthService
