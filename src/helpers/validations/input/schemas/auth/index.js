const Joi = require('joi')
const { inputErrorMessage } = require('../../../../../../locales')

const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  .message(inputErrorMessage.email_invalid_domain)
  .required()

const passwordSchema = Joi.string().min(6).max(16).required().messages({
  'string.min': inputErrorMessage.password_size,
  'string.max': inputErrorMessage.password_size,
  'any.required': inputErrorMessage.password_required
})

const userRegisterSchema = Joi.object().keys({
  name: Joi.string().min(5).max(50).required().messages({
    'string.base': inputErrorMessage.name_type_string,
    'string.min': inputErrorMessage.name_size,
    'string.max': inputErrorMessage.name_size,
    'any.required': inputErrorMessage.name_required
  }),
  password: passwordSchema,
  email: emailSchema,
  phone: Joi.string()
    .regex(/^\d{10,12}$/)
    .message(inputErrorMessage.phone_pattern)
    .required()
    .messages({
      'string.base': inputErrorMessage.phone_type_string,
      'string.pattern.base': inputErrorMessage.phone_pattern,
      'any.required': inputErrorMessage.phone_required
    })
})

const userLoginSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema
})

const userChangePasswordSchema = Joi.object().keys({
  password: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': inputErrorMessage.password_confirm
  })
})

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  userChangePasswordSchema
}
