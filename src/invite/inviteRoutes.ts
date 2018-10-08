import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getEventByInviteId } from '../event/eventGateway'
import IEvent from '../event/IEvent'
import { logError } from '../logging'
import {
  createInvite,
  deleteInvite,
  getInviteById,
  getInvitesByEventId
} from './inviteService'

const router = Router()

/**
 * @swagger
 * /invites:
 *   get:
 *     tags:
 *       - invites
 *     description: Get a list of invites filtered by event ID
 *     summary: Get a list of invites filtered by event ID
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
 *         description: All invites for an event
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/Invite'
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    if (!req.query.eventId) {
      res.send([])
      return
    }
    try {
      const invites = await getInvitesByEventId(req.query.eventId)
      res.send(invites)
    } catch (err) {
      res.status(404).send(err)
    }
  }
)

/**
 * @swagger
 * /invites/{inviteId}:
 *   get:
 *     tags:
 *       - invites
 *     description: Get an invite by ID
 *     summary: Get an invite by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An invite
 *         schema:
 *           $ref: '#/definitions/Invite'
 */
router.get('/:inviteId', async (req: Request, res: Response) => {
  const inviteId = req.params.inviteId
  if (!inviteId) {
    res.status(404).send('Invalid invite ID')
    return
  }
  try {
    const event: IEvent = await getEventByInviteId(inviteId)
    const invite = await getInviteById(inviteId)

    res.send({ ...invite, event })
  } catch (err) {
    logError('Failed to get invite', err, req)
    res.status(404).send()
  }
})

/**
 * @swagger
 * /invites/{inviteId}:
 *   delete:
 *     tags:
 *       - invites
 *     description: Delete an invite
 *     summary: Delete an invite
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Invite was deleted
 */
router.delete(
  '/:inviteId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const inviteId = req.query.inviteId
    if (!inviteId) {
      res.status(400).send('Invalid invite ID')
      return
    }
    try {
      const result = await deleteInvite(req.params.inviteId, inviteId)
      res.send(result)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

/**
 * @swagger
 * /invites:
 *   post:
 *     tags:
 *       - invites
 *     description: Create a new invite
 *     summary: Create a new invite
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Invite'
 *     responses:
 *       200:
 *         description: An invite
 *         schema:
 *           $ref: '#/definitions/Invite'
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    const invite = req.body
    try {
      const savedInvite = await createInvite(invite)
      res.send(savedInvite)
    } catch (err) {
      res.status(400).send(err)
    }
  }
)

export default router
