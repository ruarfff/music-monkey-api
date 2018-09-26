import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import EventDecorator from './EventDecorator'
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventsByUserId,
  updateEvent
} from './eventGateway'
import IEvent from './IEvent'
const router = Router()
const eventDecorator = new EventDecorator()

/**
 * @swagger
 * /events:
 *   get:
 *     tags:
 *       - events
 *     description: Get all events created by a user
 *     summary: Get all events created by a user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All events created by a user
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/Event'
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      const events: IEvent[] = await getEventsByUserId(user.userId)
      const decoratedEvents = await eventDecorator.decorateEvents(events, user)
      res.send(decoratedEvents)
    } catch (err) {
      logError('Error getting events', err, req)
      res.send([])
    }
  }
)

/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     tags:
 *       - events
 *     description: Get an event by ID
 *     summary: Get an event by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An event
 *         schema:
 *           $ref: '#/definitions/Event'
 */
router.get(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      const event: IEvent = await getEventById(req.params.eventId)
      const decoratedEvent = await eventDecorator.decorateSingleEvent(
        event,
        user
      )

      res.send(decoratedEvent)
    } catch (err) {
      logError('Error getting event by IDs', err, req)
      res.status(404).send(err)
    }
  }
)

/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - events
 *     description: Create a new event
 *     summary: Create a new event
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Event'
 *     responses:
 *       200:
 *         description: An event
 *         schema:
 *           $ref: '#/definitions/Event'
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const event = req.body

    createEvent(event)
      .then(savedEvent => {
        res.send(savedEvent)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
)

/**
 * @swagger
 * /events/{eventId}:
 *   put:
 *     tags:
 *       - events
 *     description: Update an event
 *     summary: Update an event
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Event'
 *     responses:
 *       200:
 *         description: An event
 *         schema:
 *           $ref: '#/definitions/Event'
 */
router.put(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId
      const payload = req.body
      const event = await getEventById(req.params.eventId)
      if (userId !== event.userId) {
        res.status(400).send('Cannot update event belonging to another user')
      } else if (payload.eventId !== event.eventId) {
        res.status(400).send('Cannot update event ID')
      } else {
        const updatedEvent = await updateEvent(req.body)
        res.send(updatedEvent)
      }
    } catch (err) {
      res.status(404).send(err)
    }
  }
)

/**
 * @swagger
 * /events/{eventId}:
 *   delete:
 *     tags:
 *       - events
 *     description: Delete an event
 *     summary: Delete an event
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Event was deleted
 */
router.delete(
  '/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const userId = req.user.userId

    deleteEvent(req.params.eventId, userId)
      .then(event => {
        res.send(event)
      })
      .catch(err => res.status(404).send(err))
  }
)

export default router
