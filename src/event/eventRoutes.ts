import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import {
  getEventsForUser,
  getEvent,
  saveEvent,
  updateEvent,
  deleteEvent
} from './eventService'
import IEvent from './model/IEvent'
const router = Router()

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
      const events: IEvent[] = await getEventsForUser(user)
      res.send(events)
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
      const event: IEvent = await getEvent(req.params.eventId, user)
      res.send(event)
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
  async (req: Request, res: Response) => {
    const event: IEvent = req.body
    try {
      const savedEvent = await saveEvent(event)
      res.send(savedEvent)
    } catch (err) {
      logError('Error creating event', err, req)
      res.status(400).send(err)
    }
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
      const payload = req.body
      const {user} = req
      if(!payload) {
        res.status(400).send('Cannot update event with no payload')
        return
      }
      if (payload.eventId !== req.params.eventId) {
        res.status(400).send('Cannot update event ID')
        return
      }
      const updatedEvent = await updateEvent(payload, user.userId)
      res.send(updatedEvent)
    } catch (err) {
      logError('Error updating event', err, req)
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
  async (req: Request, res: Response) => {
    const userId = req.user.userId
    try {
      const deletedEvent = await deleteEvent(req.params.eventId, userId)
      res.send(deletedEvent)
    } catch (err) {
      logError('Error deleting event', err, req)
      res.status(404).send(err)
    }
  }
)

export default router
