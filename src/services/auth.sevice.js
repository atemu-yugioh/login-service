const { BadRequestError } = require('../core/error.response')
const authRepositories = require('../models/repositories/user.repositories')
const sessionRepositories = require('../models/repositories/session.repositories')
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

    // create new User authRepositories.findByEmail(email)
    const id = newMongoObjectId()
    const newUser = await authRepositories.createUser({
      _id: id,
      email,
      name,
      password: passwordHashed,
      phone: phone,
      roles,
      createdBy: id,
      modifiedBy: id
    })

    if (newUser) {
      // generate HEX key
      const { privateKey, publicKey } = await createHEXKey()

      // create pair token
      const { accessToken, refreshToken } = await createTokenPair(
        {
          userId: newUser._id,
          email
        },
        publicKey,
        privateKey
      )

      // save session
      const session = await sessionRepositories.createSession({
        user: newUser._id,
        publicKey,
        privateKey,
        refreshToken: refreshToken,
        createdBy: newUser._id,
        modifiedBy: newUser._id
      })

      if (!session) {
        throw new BadRequestError('Error:: Session Error')
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
