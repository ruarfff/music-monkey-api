"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = require("es6-promise");
var schema = {
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
};
var params = {
    TableName: 'TABLE',
    Item: {
        CUSTOMER_ID: { N: '001' },
        CUSTOMER_NAME: { S: 'Richard Roe' }
    }
};
// Call DynamoDB to add the item to the table
ddb.putItem(params, function (err, data) {
    if (err) {
        console.log('Error', err);
    }
    else {
        console.log('Success', data);
    }
});
var tableName = 'MM-Dev-User';
var UserGateway = /** @class */ (function () {
    function UserGateway(AWS) {
        this.AWS = AWS;
        this.ddb = new this.AWS.DynamoDB({ apiVersion: '2012-10-08' });
    }
    UserGateway.prototype.createUser = function (user) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            User.create(user, function (err, userModel) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(userModel);
                }
            });
        });
    };
    UserGateway.prototype.updateUser = function (user) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            User.update(user, function (err, userModel) {
                if (err) {
                    return reject(err);
                }
                return resolve(userModel);
            });
        });
    };
    UserGateway.prototype.deleteUser = function (userId) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            User.destroy(userId, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    };
    UserGateway.prototype.getUserById = function (userId) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            User.get(userId, function (err, userModel) {
                if (err) {
                    return reject(err);
                }
                return resolve(userModel);
            });
        });
    };
    UserGateway.prototype.getUserByEmail = function (user) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            User.query(user.email)
                .usingIndex('EmailIndex')
                .limit(1)
                .exec(function (err, userModel) {
                if (err || userModel.Items.length < 1) {
                    return reject(err);
                }
                return resolve(userModel.Items[0].attrs);
            });
        });
    };
    return UserGateway;
}());
exports.default = UserGateway;
//# sourceMappingURL=userGateway.js.map