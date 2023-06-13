const { SuccessResponse, CREATED, OK } = require('../core/success.response')

class AuthController {
  register = async (req, res, next) => {
    new CREATED({
      data: {
        email: 'nguyenthieng0106@gmail.com',
        password: '111111'
      }
    }).send(res)
  }

  login = async (req, res, next) => {
    new OK({
      message: 'login success',
      data: {
        email: 'nguyenthieng0106@gmail.com',
        token: 'access token',
        refreshToken: 'refresh token'
      }
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
      data: {
        token: 'new access token',
        refreshToken: 'new refresh token'
      }
    }).send(res)
  }
}

module.exports = new AuthController()
