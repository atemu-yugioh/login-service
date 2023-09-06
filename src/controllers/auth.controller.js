const { CREATED, OK } = require('../core/success.response')
const AuthService = require('../services/auth.service')

class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Success !!',
      data: await AuthService.signUp({ ...req.body, deviceId: req.deviceId })
    }).send(res)
  }

  login = async (req, res, next) => {
    new OK({
      message: 'Success',
      data: await AuthService.login({ ...req.body, deviceId: req.deviceId })
    }).send(res)
  }

  logout = async (req, res, next) => {
    new OK({
      message: 'Success',
      data: await AuthService.logout({ ...req.session })
    }).send(res)
  }
}

module.exports = new AuthController()
