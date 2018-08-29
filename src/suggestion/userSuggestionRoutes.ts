import { Request, Response, Router } from 'express'
import * as _ from 'lodash'
import * as passport from 'passport'
import ISuggestion from './ISuggestion'
import SuggestionDecorator from './SuggestionDecorator'
import SuggestionGateway from './suggestionGateway'

const router = Router()
const suggestionGateway = new SuggestionGateway()
const suggestionDecorator = new SuggestionDecorator()

router.get(
  '/suggestions',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      let suggestions: ISuggestion[]
      if (req.query.eventId) {
        suggestions = await suggestionGateway.getSuggestionsByUserIdAndEventId(
          user.userId,
          req.query.eventId
        )
      }

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
  async (req: Request, res: Response) => {
    try {
      const suggestion = await suggestionGateway.getSuggestionById(
        req.params.suggestionId
      )

      res.send(suggestion)
    } catch (err) {
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
      const suggestion = await suggestionGateway.deleteSuggestion(
        req.params.suggestionId,
        eventId
      )
      res.send(suggestion)
    } catch (err) {
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
        result = await suggestionGateway.bulkCreateSuggestion(suggestions)
      } else {
        const suggestion = req.body
        result = await suggestionGateway.createSuggestion(suggestion)
      }

      res.send(result)
    } catch (err) {
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
