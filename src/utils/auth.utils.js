const JWT = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { BadRequestError } = require('../core/error.response')

const createPairToken = async (payload, publicKey, privateKey) => {
  console.log('🚀 ~ file: auth.utils.js:7 ~ createPairToken ~ publicKey, privateKey:', publicKey, privateKey)
  try {
    const accessToken = await JWT.sign(payload, publicKey, { expiresIn: '2d' })

    const refreshToken = await JWT.sign(payload, privateKey, { expiresIn: '5d' })

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log('error verify:: ', error)
      } else {
        console.log('decode verify::', decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
  }
}

const createRsaKey = () => {
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

const createHexKey = () => {
  const publicKey = crypto.randomBytes(64).toString('hex')
  const privateKey = crypto.randomBytes(64).toString('hex')

  return { publicKey, privateKey }
}

const verifyJWT = async (token, secretKey) => {
  try {
    return await JWT.verify(token, secretKey)
  } catch (error) {
    return null
  }
}

const hashPassWord = (password) => {
  return bcrypt.hash(password, 10)
}

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

module.exports = {
  createPairToken,
  createRsaKey,
  createHexKey,
  verifyJWT,
  hashPassWord,
  comparePassword
}
