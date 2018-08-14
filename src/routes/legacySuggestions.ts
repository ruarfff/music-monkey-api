import { Request, Response, Router } from 'express'
import * as _ from 'lodash'
import SuggestionGateway from '../event/suggestionGateway'

const router = Router()
const suggestionGateway = new SuggestionGateway()

router.get('/', (req: Request, res: Response) => {
  if (!req.query.eventId) {
    res.send([])
  }
  let query = null

  if (req.query.userId && req.query.eventId) {
    query = suggestionGateway.getSuggestionsByUserIdAndEventId(
      req.query.userId,
      req.query.eventId
    )
  } else {
    query = suggestionGateway.getSuggestionsByEventId(req.query.eventId)
  }

  query
    .then(suggestions => {
      res.send(suggestions)
    })
    .catch(err => res.status(404).send(err))
})

router.get('/:suggestionId', (req: Request, res: Response) => {
  suggestionGateway
    .getSuggestionById(req.params.suggestionId)
    .then(suggestion => {
      res.send(suggestion)
    })
    .catch(err => res.status(404).send(err))
})

router.delete('/:suggestionId', (req: Request, res: Response) => {
  const eventId = req.query.eventId
  suggestionGateway
    .deleteSuggestion(req.params.suggestionId, eventId)
    .then(suggestion => {
      res.send(suggestion)
    })
    .catch(err => res.status(404).send(err))
})

router.post('/', (req: Request, res: Response) => {
  let creationPromise
  if (_.isArray(req.body)) {
    const suggestions = req.body
    creationPromise = suggestionGateway.bulkCreateSuggestion(suggestions)
  } else {
    const suggestion = req.body
    creationPromise = suggestionGateway.createSuggestion(suggestion)
  }
  creationPromise
    .then(savedSuggestion => {
      res.send(savedSuggestion)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

router.post('/:eventId/accept', (req: Request, res: Response) => {
  const eventId = req.params.eventId
  let acceptPromise
  let suggestions = req.body
  if (!_.isArray(suggestions)) {
    suggestions = [req.body]
  }
  acceptPromise = suggestionGateway.acceptSuggestions(eventId, suggestions)
  acceptPromise
    .then(savedSuggestion => {
      res.send(savedSuggestion)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

router.post('/:suggestionId/reject', async (req: Request, res: Response) => {
  try {
    const suggestionId = req.params.suggestionId
    const rejectedSuggestion = await suggestionGateway.rejectSuggestion(
      suggestionId
    )
    res.send(rejectedSuggestion)
  } catch (err) {
    res.status(400).send(err)
  }
})

export default router
