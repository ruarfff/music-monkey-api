"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(server) {
    // Install a `/` route that returns server status
    var router = server.loopback.Router();
    router.get('/', server.loopback.status());
    server.use(router);
}
exports.default = default_1;
//# sourceMappingURL=root.js.map