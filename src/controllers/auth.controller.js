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
      message: 'login success',
      data: createHexKey()
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    new OK({
      message: 'login success',
      data: createHexKey()
    }).send(res)
  }

  changePassWord = async (req, res, next) => {
    new OK({
      message: 'login success',
      data: createHexKey()
    }).send(res)
  }
}

module.exports = new AuthController()
