const userGateway = require('../user/userGateway')

module.exports = function(server) {
  var router = server.loopback.Router();
  router.get('/user/:userid', (req, res) => {
    res.send('test')
  });
  server.use(router);
};
