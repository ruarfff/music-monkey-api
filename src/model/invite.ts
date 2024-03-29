// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import Joi from 'joi'
import { inviteTableName } from './modelConstants'

export const Invite = dynamo.define(inviteTableName, {
  hashKey: 'inviteId',

  timestamps: true,

  schema: Joi.object({
    eventId: Joi.string(),
    inviteId: dynamo.types.uuid()
  }).options({ stripUnknown: true }),

  indexes: [
    {
      hashKey: 'eventId',
      name: 'EventIdIndex',
      type: 'global'
    }
  ]
})
