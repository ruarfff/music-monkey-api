// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'
import { notificationTableName } from './modelConstants'

export interface INotification {
  notificationId: string
  userId: string
  context: string
  contextId: string
  content: string
  status: string
}

export const Notification = dynamo.define(notificationTableName, {
  hashKey: 'notificationId',
  rangeKey: 'userId',

  timestamps: true,

  schema: Joi.object({
    notificationId: dynamo.types.uuid(),
    userId: Joi.string(),
    context: Joi.string(),
    contextId: Joi.string(),
    content: Joi.string(),
    status: Joi.string()
      .valid(['Unread', 'Seen', 'Read'])
      .default('Unread')
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
