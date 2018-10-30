// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'
import { notificationTableName } from './modelConstants'

export const Notification = dynamo.define(notificationTableName, {
  hashKey: 'notificationId',
  rangeKey: 'userId',

  timestamps: true,

  schema: Joi.object({
    notificationId: dynamo.types.uuid(),
    userId: Joi.string(),
    type: Joi.string(),
    context: Joi.string(),
    contextId: Joi.string(),
    content: Joi.string(),
    status: Joi.string()
      .valid(['Unread', 'Seen', 'Read'])
      .default('Unread')
  }).options({ stripUnknown: true }),

  indexes: [
    {
      hashKey: 'userId',
      name: 'UserIdIndex',
      type: 'global'
    }
  ]
})
