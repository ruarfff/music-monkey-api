const dynamo = require('dynamodb')
const Joi = require('joi')

const User = dynamo.define('MM-Dev-User', {
  hashKey: 'userId',
  rangeKey: 'email',

  timestamps: true,

  schema: {
    userId: dynamo.types.uuid(),
    displayName: Joi.string(),
    email: Joi.string().email(),
    country: Joi.string()
      .allow('')
      .optional(),
    birthdate: Joi.string()
      .allow('')
      .optional(),
    image: Joi.string()
      .allow('')
      .optional(),
    auth: {
      refreshToken: Joi.string(),
      accessToken: Joi.string(),
      expiresIn: Joi.number()
    }
  },

  indexes: [
    {
      hashKey: 'email',
      rangeKey: 'displayName',
      name: 'EmailIndex',
      type: 'global'
    }
  ]
})

module.exports = User
