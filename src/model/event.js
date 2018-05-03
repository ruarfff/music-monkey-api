const dynamo = require('dynamodb')
const Joi = require('joi')

const Event = dynamo.define('MM-Dev-Event', {
  hashKey: 'eventId',
  rangeKey: 'userId',

  timestamps: true,

  schema: {
    eventId: dynamo.types.uuid(),
    userId: Joi.string(),
    name: Joi.string(),
    organizer: Joi.string(),
    imageUrl: Joi.string()
      .allow('')
      .optional(),
    description: Joi.string()
      .allow('')
      .optional(),
    venue: Joi.string()
      .allow('')
      .optional(),
    location: {
      address: Joi.string().default('Nowhere'),
      latLng: {
        lat: Joi.number().optional(),
        lng: Joi.number().optional()
      }
    },
    startDateTime: Joi.string(),
    endDateTime: Joi.string(),
    eventCode: Joi.string()
      .allow('')
      .optional(),
    playlist: Joi.string()
  },

  indexes: [
    {
      hashKey: 'userId',
      rangeKey: 'organizer',
      name: 'UserIdIndex',
      type: 'global'
    }
  ]
})

module.exports = Event
