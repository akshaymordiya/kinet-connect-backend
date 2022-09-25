const Joi = require("joi");

const allowedMIMETypes = ['png', 'jpeg', 'jpg'];

const activateUserProfile = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    fullName: Joi.string().required().min(6),
    userName: Joi.string().required().trim().min(6).max(20),
    avatarURL: Joi.string().default(null),
    password: Joi.string().required(),
  })
}

const userKeyValidator = {
  body: Joi.object().keys({
    key: Joi.string().required().valid('email', 'userName'),
    value: Joi.string().required(),
    excludeId: Joi.string().default(null)
  })
}

module.exports = {
  activateUserProfile,
  userKeyValidator,
  allowedMIMETypes
}
