// tslint:disable-next-line:no-var-requires
const dynamo = require('dynamodb')

import * as Joi from 'joi'

interface ISuggestionItem {
  id: string
  refId?: string
}

export interface ISuggestion {
  suggestionId: string
  eventId: string
  userId: string
  type: string
  item: ISuggestionItem
  accepted: boolean
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
    item: {
      id: Joi.string(),
      refId: Joi.string()
        .optional()
        .allow('')
        .allow(null)
    },
    accepted: Joi.boolean().default(false)
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
