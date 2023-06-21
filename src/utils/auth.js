const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { AuthFailureError } = require('../core/error.response')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '1d'
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '5d'
    })

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.error('error verify:: ', error)
      } else {
        console.log('decode verify::', decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    return error
  }
}

const createRSAKey = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  })

  return { privateKey, publicKey }
}

const createHEXKey = () => {
  const privateKey = crypto.randomBytes(64).toString('hex')
  const publicKey = crypto.randomBytes(64).toString('hex')

  return { publicKey, privateKey }
}

const verifyJWT = async (token, secretKey) => {
  try {
    return await JWT.verify(token, secretKey)
  } catch (error) {
    return null
  }
}

const isMatchPassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

const hashPassword = (password) => {
  return bcrypt.hash(password, 10)
}

module.exports = {
  createTokenPair,
  verifyJWT,
  createRSAKey,
  createHEXKey,
  isMatchPassword,
  hashPassword
}
