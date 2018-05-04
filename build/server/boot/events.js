"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eventGateway_1 = require("../event/eventGateway");
function default_1(server) {
    var router = server.loopback.Router();
    var eventGateway = new eventGateway_1.default();
    router.get('/events', function (req, res) {
        eventGateway
            .getEventsByUserId(req.query.userId)
            .then(function (events) {
            res.send(events);
        })
            .catch(function (err) { return res.status(500).send(err); });
    });
    router.get('/events/:eventId', function (req, res) {
        eventGateway
            .getEventById(req.params.eventId)
            .then(res.send)
            .catch(function (err) { return res.status(404).send(err); });
    });
    router.post('/events', function (req, res) {
        var event = req.body;
        eventGateway
            .createEvent(event)
            .then(function (savedEvent) {
            res.send(savedEvent);
        })
            .catch(function (err) {
            res.status(400).send(err);
        });
    });
    // router.put('/events/:eventId', (req: Request, res: Response) => {})
    server.use(router);
}
exports.default = default_1;
//# sourceMappingURL=events.js.map