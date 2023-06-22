const { findByEmail } = require('../models/repositories/user.repositories')

class UserService {
  static findByEmail = async (email) => {
    return findByEmail(email)
  }
}

module.exports = UserService
