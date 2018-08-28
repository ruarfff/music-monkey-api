import { Request, Response, Router } from 'express'
import * as _ from 'lodash'
import * as passport from 'passport'
import SuggestionDecorator from './SuggestionDecorator'
import SuggestionGateway from './suggestionGateway'

const router = Router()
const suggestionGateway = new SuggestionGateway()
const suggestionDecorator = new SuggestionDecorator()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user
      if (!req.query.eventId) {
        res.send([])
      }
      const suggestions = await suggestionGateway.getSuggestionsByEventId(
        req.query.eventId
      )

      const decoratedSuggestions = await suggestionDecorator.decorateSuggestions(
        suggestions,
        user
      )

      res.send(decoratedSuggestions)
    } catch (err) {
      res.status(404).send(err)
    }
  }
)

router.get(
  '/:suggestionId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    suggestionGateway
      .getSuggestionById(req.params.suggestionId)
      .then(suggestion => {
        res.send(suggestion)
      })
      .catch(err => res.status(404).send(err))
  }
)

router.delete(
  '/:suggestionId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const eventId = req.query.eventId
    suggestionGateway
      .deleteSuggestion(req.params.suggestionId, eventId)
      .then(suggestion => {
        res.send(suggestion)
      })
      .catch(err => res.status(404).send(err))
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
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
  }
)

router.post(
  '/:eventId/accept',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const eventId = req.params.eventId
      let suggestions = req.body
      if (!_.isArray(suggestions)) {
        suggestions = [req.body]
      }
      const savedSuggestion = await suggestionGateway.acceptSuggestions(
        eventId,
        suggestions
      )

      res.send(savedSuggestion)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

router.post(
  '/:suggestionId/reject',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const suggestionId = req.params.suggestionId
      const rejectedSuggestion = await suggestionGateway.rejectSuggestion(
        suggestionId
      )
      res.send(rejectedSuggestion)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

export default router
