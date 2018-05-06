// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'

export interface IUserAuth {
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export interface IUser {
  auth: IUserAuth
  birthdate: string
  country: string
  displayName: string
  email: string
  image: string
  spotifyId: string
  userId: string
}

export const User = dynamo.define('MM-Dev-User', {
  hashKey: 'userId',
  rangeKey: 'email',

  timestamps: true,

  schema: {
    auth: {
      accessToken: Joi.string(),
      expiresIn: Joi.number(),
      refreshToken: Joi.string()
    },
    birthdate: Joi.string()
      .allow('')
      .optional(),
    country: Joi.string()
      .allow('')
      .optional(),
    displayName: Joi.string(),
    email: Joi.string().email(),
    image: Joi.string()
      .allow('')
      .optional(),
    spotifyId: Joi.string()
      .allow('')
      .optional(),
    userId: dynamo.types.uuid()
  },

  indexes: [
    {
      hashKey: 'email',
      name: 'EmailIndex',
      rangeKey: 'displayName',
      type: 'global'
    }
  ]
})
