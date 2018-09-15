import { Request, Response, Router } from 'express'
import * as _ from 'lodash'
import * as passport from 'passport'
import { logError } from '../logging'
import SuggestionDecorator from './SuggestionDecorator'
import {
  acceptSuggestions,
  createSuggestion,
  createSuggestions,
  deleteSuggestion,
  getSuggestionById,
  getSuggestionsByEventId,
  rejectSuggestion
} from './suggestionService'

const router = Router()
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
      const suggestions = await getSuggestionsByEventId(req.query.eventId)

      const decoratedSuggestions = await suggestionDecorator.decorateSuggestions(
        suggestions,
        user
      )

      res.send(decoratedSuggestions)
    } catch (err) {
      logError('Failed to fetch suggestions for event', err, req)
      res.status(404).send(err)
    }
  }
)

router.get(
  '/:suggestionId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const suggestion = await getSuggestionById(req.params.suggestionId)

      res.send(suggestion)
    } catch (err) {
      logError('Failed to fetch suggestion by id', err, req)
      res.status(404).send(err)
    }
  }
)

router.delete(
  '/:suggestionId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const eventId = req.query.eventId
      const suggestion = await deleteSuggestion(
        req.params.suggestionId,
        eventId
      )
      res.send(suggestion)
    } catch (err) {
      logError('Failed to delete suggestion', err, req)
      res.status(404).send(err)
    }
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      let result
      if (_.isArray(req.body)) {
        const suggestions = req.body
        result = await createSuggestions(suggestions)
      } else {
        const suggestion = req.body
        result = await createSuggestion(suggestion)
      }

      res.send(result)
    } catch (err) {
      logError('Failed to create suggestion', err, req)
      res.status(400).send(err)
    }
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
      const savedSuggestion = await acceptSuggestions(eventId, suggestions)

      res.send(savedSuggestion)
    } catch (err) {
      logError('Failed to accept suggestion', err, req)
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
      const rejectedSuggestion = await rejectSuggestion(suggestionId)
      res.send(rejectedSuggestion)
    } catch (err) {
      logError('Failed to reject suggestion', err, req)
      res.status(400).send(err)
    }
  }
)

export default router
