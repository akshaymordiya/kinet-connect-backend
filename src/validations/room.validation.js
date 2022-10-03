const Joi = require("joi");

const createRoom = {
  body: Joi.object().keys({
    topic: Joi.string().required().min(20).max(80),
    description: Joi.string().required().min(30).max(100),
    hostBy: Joi.string().required(),
    type: Joi.string().valid('public', 'private').required(),
    destroyExistingAndCreateNew: Joi.boolean()
  })
}

module.exports = {
  createRoom
}