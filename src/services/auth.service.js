const { BadRequestError, AuthFailError } = require('../core/error.response')
const { deleteByUserId } = require('../models/repositories/session.repositories')
const { findByEmail, create, findById, updatePassword } = require('../models/repositories/user.repositories')
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
        createdBy: _id,
        modifiedBy: _id
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
      createdBy: userId,
      modifiedBy: userId
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

  static logout = async ({ session }) => {
    return await SessionService.deleteById(session._id)
  }

  static handleRefreshToken = async ({ user, session, refreshToken }) => {
    const { userId, email, deviceId } = user
    const { publicKey, privateKey, refreshToken: refreshTokenStore, refreshTokenUsed } = session

    // check user exist
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new AuthFailError('User invalid, pls re-login')
    }

    // check refreshToken đã được sử dụng chưa
    if (refreshTokenUsed.includes(refreshToken)) {
      // đã có người dùng nó để refresh rồi => xóa hết session
      // login lại cho an toàn => nếu là người dùng thật sự sẽ login lại được
      await SessionService.deleteByUserId(userId)
      throw new AuthFailError('Something went wrong, pls login')
    }

    // check refreshToken === refreshTokenStore
    if (refreshToken !== refreshTokenStore) {
      // nếu đã gửi refreshToken rồi mà còn sai nữa thì chỉ có login lại
      // nếu là user sẽ login lại được
      throw new AuthFailError('RefreshToken invalid, pls re-login')
    }

    // create new pair token
    const token = await createPairToken({ userId, email, deviceId }, publicKey, privateKey)

    // push refreshToken to refreshTokenUsed
    await SessionService.saveToRefreshTokenUsed({ ...session, newRefreshToken: token.refreshToken })

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
      throw new BadRequestError('Error::: miss field')
    }

    // check user exist
    const userFound = await findByEmail(email)

    if (!userFound) {
      throw new BadRequestError('Error::: User not registered !!!')
    }

    // check password correct
    const isMatch = await comparePassword(password, userFound.password)

    if (!isMatch) {
      throw new BadRequestError('Error::: password incorret !!!')
    }

    // hashed new password
    const newPasswordHashed = await hashPassWord(newPassword)

    // trường hợp có người đang dùng tài khoản user ở 1 nơi khác
    // người dùng cần đổi password để không cho người kia thao tác nữa
    // nên cần clear all session của user
    await SessionService.deleteByUserId(userId)

    // create newPublicKey and newPrivateKey
    const { publicKey: newPublicKey, privateKey: newPrivateKey } = createHexKey()

    // create new pair token
    const { accessToken, refreshToken } = await createPairToken(
      { userId, email, deviceId },
      newPublicKey,
      newPrivateKey
    )

    // create new Session for user
    const newSession = await SessionService.create({
      userId,
      publicKey: newPublicKey,
      privateKey: newPrivateKey,
      refreshToken,
      deviceId,
      createdBy: userId,
      modifiedBy: userId
    })

    if (!newSession) {
      throw new BadRequestError('Error: Something went wrong !!!')
    }

    // thành công hết thì mới update password
    await updatePassword(userId, newPasswordHashed)

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

  static findById = async (id) => {
    const userFound = await findById(id)

    return userFound
      ? getInfoData({
          object: userFound,
          fields: selectFields
        })
      : null
  }
}

module.exports = AuthService
