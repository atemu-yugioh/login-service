const { SuccessResponse, CREATED, OK } = require('../core/success.response')
const AuthService = require('../services/auth.service')
const { createRSAKey, createHEXKey } = require('../utils/auth')

class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
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
      data: await AuthService.logout(req.deviceId)
    }).send(res)
  }

  changePassword = async (req, res, next) => {
    new OK({
      message: 'change password success',
      data: await AuthService.changePassword({ ...req.body, user: req.user, keyToken: req.keyToken })
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    new OK({
      message: 'success',
      data: await AuthService.handleRefreshToken({ ...req })
    }).send(res)
  }
}

module.exports = new AuthController()
