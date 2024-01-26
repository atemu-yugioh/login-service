const Joi = require('joi')
const { InputValidateError } = require('../../../core/error.response')

const validator = (validationObject) =>
  async function fn(req, res, next) {
    try {
      await validationObject.validateAsync(
        { ...req.body, ...req.params, ...req.query },
        {
          abortEarly: false
        }
      )
      return next()
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        const errorRes = error.details.map(({ message, path }) => ({
          message: message.replace(/['"]/g, ''),
          path: path[0]
        }))
        return next(new InputValidateError(errorRes))
      }
      return next(error)
    }
  }

module.exports = validator
