"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("../model");
var EventGateway = /** @class */ (function () {
    function EventGateway() {
    }
    EventGateway.prototype.createEvent = function (event) {
        return new Promise(function (resolve, reject) {
            model_1.Event.create(event, function (err, eventModel) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(eventModel);
                }
            });
        });
    };
    EventGateway.prototype.updateEvent = function (event) {
        return new Promise(function (resolve, reject) {
            model_1.Event.update(event, function (err, eventModel) {
                if (err) {
                    return reject(err);
                }
                return resolve(eventModel);
            });
        });
    };
    EventGateway.prototype.deleteEvent = function (eventId) {
        return new Promise(function (resolve, reject) {
            model_1.Event.destroy(eventId, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    };
    EventGateway.prototype.getEventById = function (eventId) {
        return new Promise(function (resolve, reject) {
            model_1.Event.get(eventId, function (err, eventModel) {
                if (err) {
                    return reject(err);
                }
                return resolve(eventModel);
            });
        });
    };
    EventGateway.prototype.getEventsByUserId = function (userId) {
        return new Promise(function (resolve, reject) {
            model_1.Event.query(userId)
                .usingIndex('UserIdIndex')
                .exec(function (err, eventModel) {
                if (err || eventModel.Items.length < 1) {
                    reject(err);
                }
                var eventList = eventModel.Items.map(function (item) { return item.attrs; });
                resolve(eventList);
            });
        });
    };
    return EventGateway;
}());
exports.default = EventGateway;
//# sourceMappingURL=eventGateway.js.map