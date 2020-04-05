// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import Joi from 'joi'
import { userTableName } from './modelConstants'

export const User = dynamo.define(userTableName, {
  hashKey: 'userId',

  timestamps: true,

  schema: Joi.object({
    spotifyAuth: {
      accessToken: Joi.string(),
      expiresIn: Joi.number(),
      expiresAt: Joi.number(),
      refreshToken: Joi.string()
    },
    facebookAuth: {
      accessToken: Joi.string(),
      expiresIn: Joi.number(),
      refreshToken: Joi.string()
    },
    birthdate: Joi.string().allow('').optional(),
    country: Joi.string().allow('').optional(),
    displayName: Joi.string().allow('', null).optional(),
    email: Joi.string().email().default('').optional(),
    image: Joi.string().allow('', null).default('').optional(),
    passwordHash: Joi.string().allow('').optional(),
    spotifyId: Joi.string().allow('').optional(),
    twitchId: Joi.string().allow('').optional(),
    phone: Joi.string().allow('').optional(),
    facebookId: Joi.string().allow('').optional(),
    instagramId: Joi.string().allow('').optional(),
    twitterId: Joi.string().allow('').optional(),
    userId: dynamo.types.uuid(),
    isGuest: Joi.bool().default(false),
    isVerified: Joi.bool().default(false)
  }).options({ stripUnknown: true }),

  indexes: [
    {
      hashKey: 'email',
      name: 'EmailIndex',
      type: 'global'
    }
  ]
})
