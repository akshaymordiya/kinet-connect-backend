const httpStatus = require('http-status');
const Joi = require('joi');
const { pick } = require("../utils/helpers");

const validateRequest = (schema, validSchemaValues = ['params', 'query', 'body']) => (req, res, next) => {
  const prepareSchema = pick(schema, validSchemaValues);
  const requestValues = pick(req, Object.keys(prepareSchema));
  const { value, error } = Joi.compile(prepareSchema).prefs({ errors:  { label: "key" }, abortEarly: true }).validate(requestValues)

  if(error){
    const message = error.details.map((detail) => detail.message).join(', ');
    return res.status(httpStatus.BAD_REQUEST).json({ statusCode: httpStatus.BAD_REQUEST, error: message });
  }

  Object.assign(req, value);
  return next();
}

module.exports = validateRequest