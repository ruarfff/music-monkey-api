// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'
import { userTableName } from './modelConstants'

export interface IUserAuth {
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export interface ISpotifyAuth {
  accessToken: string
  expiresAt: number
  refreshToken: string
}

export interface IFacebookAuth {
  accessToken: string
  refreshToken: string
}

export interface IUser {
  auth: IUserAuth
  birthdate: string
  country: string
  displayName: string
  email: string
  facebookAuth: IFacebookAuth
  facebookId: string
  image: string
  passwordHash: string
  spotifyAuth: ISpotifyAuth
  spotifyId: string
  userId: string
  isGuest: boolean
  isVerified: boolean
}

export const User = dynamo.define(userTableName, {
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
    displayName: Joi.string()
      .allow('', null)
      .optional(),
    email: Joi.string()
      .email()
      .default('')
      .optional(),
    image: Joi.string()
      .allow('', null)
      .default('')
      .optional(),
    passwordHash: Joi.string()
      .allow('')
      .optional(),
    spotifyId: Joi.string()
      .allow('')
      .optional(),
    userId: dynamo.types.uuid(),
    isGuest: Joi.bool().default(false),
    isVerified: Joi.bool().default(false)
  },

  indexes: [
    {
      hashKey: 'email',
      name: 'EmailIndex',
      type: 'global'
    }
  ]
})
