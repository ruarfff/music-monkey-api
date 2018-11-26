// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'
import { rsvpTableName } from './modelConstants'

export interface IRsvp {
  rsvpId: string
  inviteId: string
  eventId: string
  userId: string
  status: string
}

export const Rsvp = dynamo.define(rsvpTableName, {
  hashKey: 'rsvpId',
  rangeKey: 'eventId',

  timestamps: true,

  schema: Joi.object({
    rsvpId: dynamo.types.uuid(),
    inviteId: Joi.string(),
    eventId: Joi.string(),
    userId: Joi.string(),
    status: Joi.string()
      .valid(['Going', 'Not Going', 'Maybe'])
      .default('Maybe')
  }).options({ stripUnknown: true }),

  indexes: [
    {
      hashKey: 'eventId',
      rangeKey: 'userId',
      name: 'EventIdUserIdIndex',
      type: 'global'
    },
    {
      hashKey: 'inviteId',
      rangeKey: 'userId',
      type: 'global',
      name: 'InviteIdUserIdIndex'
    },
    {
      hashKey: 'userId',
      name: 'UserIdIndex',
      type: 'global'
    }
  ]
})
