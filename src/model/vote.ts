// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'
import { voteTableName } from './modelConstants'

export const Vote = dynamo.define(voteTableName, {
  hashKey: 'voteId',
  rangeKey: 'eventId',

  timestamps: true,

  schema: {
    voteId: Joi.string(),
    trackId: Joi.string(),
    eventId: Joi.string(),
    userId: Joi.string()
  },

  indexes: [
    {
      hashKey: 'eventId',
      rangeKey: 'userId',
      name: 'EventIdUserIdIndex',
      type: 'global'
    },
    {
      hashKey: 'userId',
      rangeKey: 'trackId',
      type: 'global',
      name: 'UserIdTrackIdIndex'
    }
  ]
})