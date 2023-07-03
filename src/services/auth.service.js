const { BadRequestError } = require('../core/error.response')
const { findByEmail, create } = require('../models/repositories/user.repositories')
const { generateObjectMongodb, getInfoData } = require('../utils')
const { hashPassWord, createHexKey, createPairToken, comparePassword } = require('../utils/auth.utils')
const SessionService = require('./session.service')

const selectFields = ['name', 'email', 'phone', 'addess', 'birthDay', 'avatar']

class AuthService {
  static signUp = async ({ email, name, password, phone, deviceId, ...other }) => {
    // check user exist
    const userFound = await findByEmail(email)

    if (userFound) {
      throw new BadRequestError('email already regitered !!!')
    }

    // hash password
    const passwordHashed = await hashPassWord(password)

    // create new user
    const _id = generateObjectMongodb()
    const newUser = await create({
      _id,
      email,
      password: passwordHashed,
      phone,
      name,
      createdBy: _id,
      modifiedBy: _id,
      ...other
    })

    // create success
    if (newUser._doc) {
      // create publicKey and privateKey
      const { publicKey, privateKey } = createHexKey()

      // create pair token
      const { accessToken, refreshToken } = await createPairToken(
        { userId: _id, email, deviceId },
        publicKey,
        privateKey
      )

      // save session user
      const newSession = await SessionService.create({
        userId: _id,
        publicKey,
        privateKey,
        refreshToken,
        deviceId,
        createdby: _id,
        modifiedby: _id
      })

      if (!newSession) {
        throw new BadRequestError('Error: `session fail` something went wrong')
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
      throw new BadRequestError('Error::: User not regitered !!!')
    }

    // compare password
    const isMatch = await comparePassword(password, userFound.password)

    if (!isMatch) {
      throw new BadRequestError('Error::: password invalid !!!')
    }

    // create publicKey and privateKey
    const { publicKey, privateKey } = createHexKey()

    // create pair token
    const userId = userFound._id
    const { accessToken, refreshToken } = await createPairToken({ userId, email, deviceId }, publicKey, privateKey)

    // create or update session
    const newSession = await SessionService.create({
      userId,
      publicKey,
      privateKey,
      deviceId,
      refreshToken,
      createdby: userId,
      modifiedby: userId
    })

    if (!newSession) {
      throw new BadRequestError('Error::: `session fail` something went wrong')
    }

    return {
      token: {
        accessToken,
        refreshToken
      },
      user: getInfoData({
        object: userFound,
        fields: selectFields
      })
    }
  }
}

module.exports = AuthService
