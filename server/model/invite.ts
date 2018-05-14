// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'

export interface IInvite {
  inviteId: string
  eventId: string
}

export const Invite = dynamo.define('MM-Dev-Invite', {
  hashKey: 'inviteId',
  rangeKey: 'eventId',

  timestamps: true,

  schema: {
    eventId: Joi.string(),
    inviteId: dynamo.types.uuid()
  },

  indexes: [
    {
      hashKey: 'eventId',
      name: 'EventIdIndex',
      type: 'global'
    }
  ]
})
