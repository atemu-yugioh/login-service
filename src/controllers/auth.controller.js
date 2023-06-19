const { SuccessResponse, CREATED, OK } = require('../core/success.response')
const AuthService = require('../services/auth.sevice')
const { createRSAKey, createHEXKey } = require('../utils/auth')

class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
      data: await AuthService.SignUp({ ...req.body })
    }).send(res)
  }

  login = async (req, res, next) => {
    new OK({
      message: 'login success',
      data: createRSAKey()
    }).send(res)
  }

  logout = async (req, res, next) => {
    new OK({
      message: 'logout success',
      data: null
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    new OK({
      message: 'success',
      data: createHEXKey()
    }).send(res)
  }
}

module.exports = new AuthController()
