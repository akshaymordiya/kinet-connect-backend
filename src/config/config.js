const Joi = require("joi");
const path = require('path');
const dotenv = require('dotenv');
const { join } = require("path");

dotenv.config({ path: path.join(__dirname, '../../.env') });
const envVariablesSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  APP_BASE_URL: Joi.string().required().description('Application base url'),
  PORT: Joi.number().default(5500),
  MONGODB_URL: Joi.string().required().description('Mongoose coonect url'),
  HASH_SECRET: Joi.string().required().description('Hash secret key'),
  WEBSITE: Joi.string().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  EMAIL_FROM: Joi.string().email().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required().description('access token'),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required().description('refresh token')
})

const { value: envVariable, error } = envVariablesSchema.prefs({ errors: { label: "key" }}).validate(dotenv.config().parsed);

if(error){
  throw new Error(`Configuration validation failed : ${error.message}`)
}

module.exports = {
  env: envVariable.NODE_ENV,
  port: envVariable.PORT,
  appUrl: envVariable.APP_BASE_URL,
  mongoose: {
    url: envVariable.MONGODB_URL + (envVariable.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  secretKeys: {
    hash: envVariable.HASH_SECRET
  },
  website: envVariable.WEBSITE,
  email: {
    smtp: {
      host: envVariable.SMTP_HOST,
      port: envVariable.SMTP_PORT,
      auth: {
        user: envVariable.SMTP_USERNAME,
        pass: envVariable.SMTP_PASSWORD,
      },
    },
    from: envVariable.EMAIL_FROM,
  },
  jwt: {
    accessTokenSecret: envVariable.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: envVariable.JWT_REFRESH_TOKEN_SECRET
  },
  OTPExpiryDefaultTime: 1000 * 60 * 5
}