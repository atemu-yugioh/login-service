const { successMessage } = require('../../locales')
const { HEADER } = require('../configs/constant.config')
const { CREATED, OK } = require('../core/success.response')
const AuthService = require('../services/auth.service')

class AuthController {
  signUp = async (req, res) => {
    new CREATED({
      message: req.t(successMessage.register_success),
      data: await AuthService.signUp({ ...req.body, deviceId: req.deviceId })
    }).send(res)
  }

  login = async (req, res) => {
    new OK({
      message: req.t(successMessage.login_success),
      data: await AuthService.login({ ...req.body, deviceId: req.deviceId })
    }).send(res)
  }

  logout = async (req, res) => {
    new OK({
      message: 'Success',
      data: await AuthService.logout({ ...req.session })
    }).send(res)
  }

  handleRefreshToken = async (req, res) => {
    new OK({
      message: 'Success',
      data: await AuthService.handleRefreshToken({ ...req })
    }).send(res)
  }

  changePassword = async (req, res) => {
    new OK({
      message: 'Success',
      data: await AuthService.changePassword({ user: req.user, ...req.body })
    }).send(res)
  }

  enable2FA = async (req, res) => {
    new OK({
      message: 'Success',
      data: await AuthService.enable2FA(req.user.userId)
    }).send(res)
  }

  disable2FA = async (req, res) => {
    new OK({
      message: 'Success',
      data: await AuthService.disable2FA(req.user.userId)
    }).send(res)
  }

  verify2FA = async (req, res) => {
    new OK({
      message: 'Success',
      data: await AuthService.verify2FA({ ...req.body, id: req.headers[HEADER.CLIENT_ID]?.toString() })
    }).send(res)
  }
}

module.exports = new AuthController()
