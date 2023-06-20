const { BadRequestError } = require('../core/error.response')
const { findByEmail, createUser } = require('../models/repositories/auth.repositories')
const { createKeyToken } = require('../models/repositories/keyToken.repositories')
const { generateObjectMongodbId, getInfoData } = require('../utils')
const { hashedPassword, createHEXKey, createTokenPair } = require('../utils/auth')

class AuthService {
  static signUp = async ({ email, name, password, phone, roles, ...other }) => {
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
      const { accessToken, refreshToken } = await createTokenPair({ userId: newUser._id, email }, publicKey, privateKey)

      // create key store
      const newKeyToken = await createKeyToken({
        user: newUser._id,
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
}

module.exports = AuthService
