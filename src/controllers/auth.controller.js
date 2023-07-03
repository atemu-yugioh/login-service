const { OK, CREATED } = require('../core/success.response')
const { createRsaKey, createHexKey } = require('../utils/auth.utils')

class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'sign up success',
      data: createRsaKey()
    }).send(res)
  }

  login = async (req, res, next) => {
    new OK({
      message: 'login success',
      data: createHexKey()
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
