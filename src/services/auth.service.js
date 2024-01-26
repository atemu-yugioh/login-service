const { BadRequestError, AuthFailError } = require('../core/error.response')
const { findByEmail, create, findById, updatePassword, enable2FA } = require('../models/repositories/user.repositories')
const sessionRepo = require('../models/repositories/session.repositories')
const { hashPassword, createHexKey, createPairToken, comparePassword } = require('../utils/auth.utils')
const { getInfoData, generateObjectMongodbId } = require('../utils')
const { generateUniqueSecret, generateOTPToken, generateQRCode, verifyOTPToken } = require('../helpers/2FA/2fa.helper')
const RedisService = require('./redis/redis.service')

const selectFields = ['_id', 'name', 'email', 'phone', 'address', 'birthDay', 'avatar', 'is2FAEnabled']
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

    return {
      token: {
        accessToken: null,
        refreshToken: null
      },
      user: null
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

    // có bật bảo mật 2 lớp => return token null, session inactive
    if (userFound.is2FAEnabled) {
      await RedisService.setEx({
        key: `sessionInvalid:${newSession._id.toString()}`,
        value: newSession._id.toString(),
        time: 60 * 5 // 5'
      })
    }

    return {
      token: {
        accessToken,
        refreshToken,
        session: {
          id: newSession._id,
          isValid: !userFound.is2FAEnabled
        }
      },
      user: getInfoData({ object: userFound, fields: selectFields })
    }
  }

  static logout = async (session) => {
    return sessionRepo.deleteById(session._id)
  }

  static handleRefreshToken = async ({ user, session, refreshToken }) => {
    const { userId, email, deviceId } = user
    const { publicKey, privateKey, refreshToken: refreshTokenStore, refreshTokenUsed } = session

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

    // check refreshToken  === refreshTokenStore
    if (refreshToken !== refreshTokenStore) {
      throw new AuthFailError('RefreshToken invalid,pls re-login')
    }

    // create pair token
    const token = await createPairToken({ userId, email, deviceId }, publicKey, privateKey)

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

  static changePassword = async ({ user, password, newPassword, confirmPassword }) => {
    const { userId, email, deviceId } = user

    // check at middleware
    if (!password || !newPassword || !confirmPassword) {
      throw new BadRequestError('Error:: miss field')
    }

    // check user exist
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new BadRequestError('Error:: user not registered!!')
    }

    // check valid password
    const isMatch = await comparePassword(password, userFound.password)

    if (!isMatch) {
      throw new BadRequestError('Error: password wrong')
    }

    // hashed new password
    const newPasswordHashed = await hashPassword(newPassword)

    // clear all session
    await sessionRepo.deleteByUserId(userId)

    // create public key and private key
    const { publicKey, privateKey } = createHexKey()

    // create new pair token
    const { accessToken, refreshToken } = await createPairToken({ userId, email, deviceId }, publicKey, privateKey)

    // create new session
    const newSession = sessionRepo.create({
      userId,
      publicKey,
      privateKey,
      refreshToken,
      createdBy: userId,
      modifiedBy: userId,
      deviceId
    })

    if (!newSession) {
      throw new BadRequestError('Error:: Session fail')
    }

    // update password
    await updatePassword(userId, newPasswordHashed)

    return {
      token: {
        accessToken,
        refreshToken
      },
      user: getInfoData({ object: userFound, fields: selectFields })
    }
  }

  static findById = async (id) => {
    const userFound = await findById(id)

    return userFound ? getInfoData({ object: userFound, fields: selectFields }) : null
  }

  static enable2FA = async (id) => {
    const userFound = await findById(id)

    if (!userFound) {
      throw new BadRequestError('user not exist!!')
    }

    // 2fa is enabling => return true
    if (userFound.is2FAEnabled) {
      throw new BadRequestError('2fa is enabling')
    }

    // 2fa first enable
    if (!userFound.secretKeyOTP) {
      const secretKeyOTP = generateUniqueSecret()
      userFound.secretKeyOTP = secretKeyOTP
    }

    const optAuth = generateOTPToken(userFound._id, 'loginService', userFound.secretKeyOTP)
    const QRCodeImageUrl = await generateQRCode(optAuth)

    // 2fa is off => update on
    await enable2FA(userFound._id, true, userFound.secretKeyOTP)

    return {
      qrCode: QRCodeImageUrl
    }
  }

  static disable2FA = async (id) => {
    const userFound = await findById(id)

    if (!userFound) {
      throw new BadRequestError('user not exist!!')
    }

    return enable2FA(id, false, userFound.secretKeyOTP)
  }

  static verify2FA = async ({ id, otp, sessionId }) => {
    const userFound = await findById(id)

    if (!userFound) {
      throw new BadRequestError('user not exist!!')
    }

    const isValid = verifyOTPToken(otp, userFound.secretKeyOTP)

    if (isValid) {
      await RedisService.deleteKey(`sessionInvalid:${sessionId}`)
    }

    return {
      isValid
    }
  }
}

module.exports = AuthService
