const eventGateway = require('../../src/event/eventGateway')

module.exports = function(server) {
  const router = server.loopback.Router()

  router.get('/events', (req, res) => {
    eventGateway
      .getEventsByUserId(req.query.userId)
      .then((events) => {
        res.send(events)
      })
      .catch(err => res.status(500).send(err))
  })

  router.get('/events/:eventId', (req, res) => {
    eventGateway
      .getEventById(req.params.eventId)
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
