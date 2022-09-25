const Joi = require('joi');

const manualLogin = {
  body: Joi.object().keys({
    username: Joi.string().required().trim().min(6).max(20),
    password: Joi.string().required()
  })
}

const sendOTP = {
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  }),
};


const verifyOTP = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
    hashedText: Joi.string().required()
  })
}

module.exports = {
  manualLogin,
  sendOTP,
  verifyOTP
}