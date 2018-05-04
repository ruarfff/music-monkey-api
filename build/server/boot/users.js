"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userGateway_1 = require("../user/userGateway");
function default_1(server) {
    var router = server.loopback.Router();
    var userGateway = new userGateway_1.default();
    router.get('/users/:userId', function (req, res) {
        userGateway
            .getUserById(req.params.userId)
            .then(res.send)
            .catch(function (err) { return res.status(404).send(err); });
    });
    server.use(router);
}
exports.default = default_1;
//# sourceMappingURL=users.js.map