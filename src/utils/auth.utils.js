const bcrypt = require('bcrypt')
const crypto = require('crypto')
const JWT = require('jsonwebtoken')
const { BadRequestError } = require('../core/error.response')

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10)
}

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

const createHexKey = () => {
  const publicKey = crypto.randomBytes(64).toString('hex')
  const privateKey = crypto.randomBytes(64).toString('hex')

  return { publicKey, privateKey }
}

const createPairToken = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, { expiresIn: '2d' })

    const refreshToken = await JWT.sign(payload, privateKey, { expiresIn: '5d' })

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        throw new BadRequestError('generate token error !!')
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    return { accessToken: null, refreshToken: null }
  }
}

const verifyJWT = async (token, secretKey) => {
  try {
    return await JWT.verify(token, secretKey)
  } catch (error) {
    return null
  }
}

module.exports = {
  hashPassword,
  createHexKey,
  createPairToken,
  comparePassword,
  verifyJWT
}
