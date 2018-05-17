// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'

export interface ISuggestion {
  suggestionId: string
  eventId: string
  userId: string
  type: string
  item: string
}

export const Suggestion = dynamo.define('MM-Dev-Suggestion', {
  hashKey: 'suggestionId',
  rangeKey: 'eventId',

  timestamps: true,

  schema: {
    suggestionId: dynamo.types.uuid(),
    eventId: Joi.string(),
    userId: Joi.string(),
    type: Joi.string().valid(['track', 'playlist']),
    item: Joi.string()
  },

  indexes: [
    {
      hashKey: 'eventId',
      name: 'UserEventIdIndex',
      rangeKey: 'userId',
      type: 'global'
    }
  ]
})
