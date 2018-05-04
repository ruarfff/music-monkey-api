"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var dynamo = require("dynamodb");
var Joi = require("joi");
exports.Event = dynamo.define('MM-Dev-Event', {
    hashKey: 'eventId',
    rangeKey: 'userId',
    timestamps: true,
    schema: {
        description: Joi.string()
            .allow('')
            .optional(),
        endDateTime: Joi.string(),
        eventCode: Joi.string()
            .allow('')
            .optional(),
        eventId: dynamo.types.uuid(),
        imageUrl: Joi.string()
            .allow('')
            .optional(),
        location: {
            address: Joi.string().default('Nowhere'),
            latLng: {
                lat: Joi.number().optional(),
                lng: Joi.number().optional()
            }
        },
        name: Joi.string(),
        organizer: Joi.string(),
        playlist: Joi.string(),
        startDateTime: Joi.string(),
        userId: Joi.string(),
        venue: Joi.string()
            .allow('')
            .optional()
    },
    indexes: [
        {
            hashKey: 'userId',
            name: 'UserIdIndex',
            rangeKey: 'organizer',
            type: 'global'
        }
    ]
});
//# sourceMappingURL=event.js.map