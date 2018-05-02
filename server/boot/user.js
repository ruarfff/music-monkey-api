const userGateway = require('../../src/user/userGateway')

module.exports = function(server) {
  const router = server.loopback.Router();
  router.get('/user/:userid', (req, res) => {
    userGateway.getUserById(req.params.userId).then(res.send).catch(err => res.status(404).send(err))
  });
  server.use(router);
};
