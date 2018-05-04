"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var dynamo = require('dynamodb');
var Joi = require("joi");
exports.User = dynamo.define('MM-Dev-User', {
    hashKey: 'userId',
    rangeKey: 'email',
    timestamps: true,
    schema: {
        auth: {
            accessToken: Joi.string(),
            expiresIn: Joi.number(),
            refreshToken: Joi.string()
        },
        birthdate: Joi.string()
            .allow('')
            .optional(),
        country: Joi.string()
            .allow('')
            .optional(),
        displayName: Joi.string(),
        email: Joi.string().email(),
        image: Joi.string()
            .allow('')
            .optional(),
        userId: dynamo.types.uuid()
    },
    indexes: [
        {
            hashKey: 'email',
            name: 'EmailIndex',
            rangeKey: 'displayName',
            type: 'global'
        }
    ]
});
//# sourceMappingURL=user.js.map