"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = require("es6-promise");
var model_1 = require("../model");
var UserGateway = /** @class */ (function () {
    function UserGateway() {
    }
    UserGateway.prototype.createUser = function (user) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            model_1.User.create(user, function (err, userModel) {
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
            model_1.User.update(user, function (err, userModel) {
                if (err) {
                    return reject(err);
                }
                return resolve(userModel);
            });
        });
    };
    UserGateway.prototype.deleteUser = function (userId) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            model_1.User.destroy(userId, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    };
    UserGateway.prototype.getUserById = function (userId) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            model_1.User.get(userId, function (err, userModel) {
                if (err) {
                    return reject(err);
                }
                return resolve(userModel);
            });
        });
    };
    UserGateway.prototype.getUserByEmail = function (user) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            model_1.User.query(user.email)
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