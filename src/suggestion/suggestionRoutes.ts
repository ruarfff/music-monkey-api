import { Request, Response, Router } from 'express'
import _ from 'lodash'
import passport from 'passport'
import { getEventById } from '../event/eventGateway'
import { logError } from '../logging'
import SuggestionDecorator from './SuggestionDecorator'
import {
  acceptSuggestion,
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

/**
 * @swagger
 * /suggestions:
 *   get:
 *     tags:
 *       - suggestions
 *     description: Get a list of suggestions filtered by event ID
 *     summary: Get a list of suggestions filtered by event ID
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Event ID for filter on
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All suggestions for an event
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/Suggestion'
 */
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

/**
 * @swagger
 * /suggestions/{suggestionId}:
 *   get:
 *     tags:
 *       - suggestions
 *     description: Get an suggestion by ID
 *     summary: Get an suggestion by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A suggestion
 *         schema:
 *           $ref: '#/definitions/Suggestion'
 */
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

/**
 * @swagger
 * /suggestions/{suggestionId}:
 *   delete:
 *     tags:
 *       - suggestions
 *     description: Delete a suggestion
 *     summary: Delete a suggestion
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Suggestion was deleted
 */
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

/**
 * @swagger
 * /suggestions:
 *   post:
 *     tags:
 *       - suggestions
 *     description: Create a new suggestion
 *     summary: Create a new suggestion
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Suggestion'
 *     responses:
 *       200:
 *         description: A suggestion
 *         schema:
 *           $ref: '#/definitions/Suggestion'
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      let result
      if (_.isArray(req.body)) {
        const suggestions = req.body
        const event = await getEventById(suggestions[0].eventId)
        if (event.settings.suggestingPlaylistsEnabled) {
          result = await createSuggestions(suggestions)
        }
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

/**
 * @swagger
 * /suggestions/event/{eventId}/accept:
 *   post:
 *     tags:
 *       - suggestions
 *     description: Accept one or more than one suggestion for an event
 *     summary: Accept one or more than one suggestion for an event
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Suggestion'
 *     responses:
 *       200:
 *         description: A suggestion
 *         schema:
 *           $ref: '#/definitions/Suggestion'
 */
router.post(
  '/event/:eventId/accept',
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

/**
 * @swagger
 * /suggestions/{suggestionId}/accept:
 *   post:
 *     tags:
 *       - suggestions
 *     description: Accept one or more than one suggestion
 *     summary: Accept one or more than one suggestion
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Suggestion'
 *     responses:
 *       200:
 *         description: A suggestion
 *         schema:
 *           $ref: '#/definitions/Suggestion'
 */
router.post(
  '/:suggestionId/accept',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const suggestionId = req.params.suggestionId
      const savedSuggestion = await acceptSuggestion(suggestionId)
      res.send(savedSuggestion)
    } catch (err) {
      logError('Failed to accept suggestion', err, req)
      res.status(400).send(err)
    }
  }
)

/**
 * @swagger
 * /suggestions/{suggestionId}/reject:
 *   post:
 *     tags:
 *       - suggestions
 *     description: Reject one suggestion
 *     summary: Reject one suggestion
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Suggestion'
 *     responses:
 *       200:
 *         description: A suggestion
 *         schema:
 *           $ref: '#/definitions/Suggestion'
 */
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
