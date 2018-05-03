const eventGateway = require('../../src/event/eventGateway')

module.exports = function(server) {
  const router = server.loopback.Router()
  router.get('/events/:eventId', (req, res) => {
    eventGateway
      .getUserById(req.params.userId)
      .then(res.send)
      .catch(err => res.status(404).send(err))
  })
  router.post('/events', (req, res) => {
    const event = req.body
    eventGateway
      .createEvent(event)
      .then(savedEvent => {
        res.send(savedEvent)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  })
  server.use(router)
}
