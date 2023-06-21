const { BadRequestError } = require('../core/error.response')
const authRepositories = require('../models/repositories/user.repositories')
const keyTokenRepositories = require('../models/repositories/keyToken.repositories')
const { newMongoObjectId, getInfoData } = require('../utils')
const { hashPassword, createHEXKey, createTokenPair } = require('../utils/auth')

class AuthService {
  constructor() {}

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
}

module.exports = AuthService
