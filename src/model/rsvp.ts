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

  schema: {
    rsvpId: dynamo.types.uuid(),
    inviteId: Joi.string(),
    eventId: Joi.string(),
    userId: Joi.string(),
    status: Joi.string()
      .valid(['Going', 'Not Going', 'Maybe', 'Pending'])
      .default('Pending')
  },

  indexes: [
    {
      hashKey: 'rsvpId',
      rangeKey: 'userId',
      type: 'local',
      name: 'UserIdIndex'
    }
  ]
})
