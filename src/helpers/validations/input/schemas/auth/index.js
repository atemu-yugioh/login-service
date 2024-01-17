const Joi = require('joi')

const emailSchema = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  .message('domain phải là .com hoặc .net')
  .required()

const passwordSchema = Joi.string().min(6).max(16).required().messages({
  'string.min': 'pass phải có ít nhất {#limit} ký tự.',
  'string.max': 'pass không được vượt quá {#limit} ký tự.',
  'any.required': 'password được yêu cầu'
})

const userRegisterSchema = Joi.object().keys({
  name: Joi.string().min(5).max(50).required().messages({
    'string.base': 'Trường tên phải là một chuỗi.',
    'string.min': 'Tên phải có ít nhất {#limit} ký tự.',
    'string.max': 'Tên không được vượt quá {#limit} ký tự.',
    'any.required': 'Trường tên là bắt buộc.'
  }),
  password: passwordSchema,
  email: emailSchema,
  phone: Joi.string()
    .regex(/^\d{10,12}$/)
    .message('Số điện thoại không hợp lệ')
    .required()
    .messages({
      'string.base': 'Trường số điện thoại phải là một chuỗi.',
      'string.pattern.base': 'Số điện thoại không hợp lệ, phải là chuỗi có 10-12 chữ số.',
      'any.required': 'Trường số điện thoại là bắt buộc.'
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
    'any.only': 'Confirm password phải giống với New password.'
  })
})

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  userChangePasswordSchema
}
