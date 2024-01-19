const { OK } = require('../core/success.response')
const UserService = require('../services/user.service')

class UserController {
  getDetail = async (req, res) => {
    new OK({
      message: 'user detail',
      data: await UserService.findById(req.params.id)
    }).send(res)
  }
}

module.exports = new UserController()
