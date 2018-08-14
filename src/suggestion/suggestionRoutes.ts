import { Request, Response, Router } from 'express'
import * as _ from 'lodash'
import * as passport from 'passport'
import SuggestionGateway from '../event/suggestionGateway'
import { ISuggestion } from '../model'
import SuggestionDecorator from './SuggestionDecorator'

const router = Router()
const suggestionGateway = new SuggestionGateway()
const suggestionDecorator = new SuggestionDecorator()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    if (!req.query.eventId) {
      res.send([])
    }
    let query = null

    if (user.userId && req.query.eventId) {
      query = suggestionGateway.getSuggestionsByUserIdAndEventId(
        user.userId,
        req.query.eventId
      )
    } else {
      query = suggestionGateway.getSuggestionsByEventId(req.query.eventId)
    }

    query
      .then((suggestions: ISuggestion[]) => {
        suggestionDecorator
          .decorateSuggestions(suggestions, user)
          .then(decoratedSuggestions => {
            res.send(decoratedSuggestions)
          })
      })
      .catch(err => {
        res.status(404).send(err)
      })
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

export default router
