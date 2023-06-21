const { BadRequestError } = require('../core/error.response')
const authRepositories = require('../models/repositories/user.repositories')
const keyTokenRepositories = require('../models/repositories/keyToken.repositories')
const { newMongoObjectId, getInfoData } = require('../utils')
const { hashPassword, createHEXKey, createTokenPair } = require('../utils/auth')
const { isMatchPassword } = require('../utils/auth')

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

      // save keyToken
      const keyToken = await keyTokenRepositories.createKeyToken({
        userId: userId,
        publicKey,
        privateKey,
        refreshToken: refreshToken,
        createdBy: userId,
        modifiedBy: userId
      })

      if (!keyToken) {
        throw new BadRequestError('Error:: keyToken Error')
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

    // create or update KeyToken
    const keyToken = await keyTokenRepositories.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken,
      createdBy: userId,
      modifiedBy: userId
    })

    if (!keyToken) {
      throw new BadRequestError('Error: keyToken Error')
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
}

module.exports = AuthService
