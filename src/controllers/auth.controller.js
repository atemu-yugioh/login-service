const { OK, CREATED } = require('../core/success.response')
const AuthService = require('../services/auth.service')
const { createRsaKey, createHexKey } = require('../utils/auth.utils')

class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'sign up success',
      data: await AuthService.signUp({ ...req.body, deviceId: req.deviceId })
    }).send(res)
  }

  login = async (req, res, next) => {
    new OK({
      message: 'login success',
      data: await AuthService.login({ ...req.body, deviceId: req.deviceId })
    }).send(res)
  }

  logout = async (req, res, next) => {
    new OK({
      message: 'logout success',
      data: await AuthService.logout({ session: req.session })
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    new OK({
      message: 'get token success',
      data: await AuthService.handleRefreshToken({ ...req })
    }).send(res)
  }

  changePassWord = async (req, res, next) => {
    new OK({
      message: 'change password success',
      data: await AuthService.changePassword({ ...req, ...req.body })
    }).send(res)
  }
}

module.exports = new AuthController()
