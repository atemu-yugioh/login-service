const { HEADER } = require('../configs/config.constant')
const { CREATED, OK } = require('../core/success.response')
const AuthService = require('../services/auth.sevice')
const { createHEXKey } = require('../utils/auth')

class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
      data: await AuthService.SignUp({ ...req.body, deviceId: req.deviceId })
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
      data: await AuthService.logout({ ...req.sessionToken })
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
