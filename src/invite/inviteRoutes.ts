import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getEventByInviteId } from '../event/eventGateway'
import IEvent from '../event/IEvent'
import { logError } from '../logging'
import InviteGateway from './inviteGateway'

const router = Router()
const inviteGateway = new InviteGateway()

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
  (req: Request, res: Response) => {
    if (!req.query.eventId) {
      res.send([])
    }
    inviteGateway
      .getInvitesByEventId(req.query.eventId)
      .then(invite => {
        res.send(invite)
      })
      .catch(err => res.status(404).send(err))
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
  try {
    const event: IEvent = await getEventByInviteId(req.params.inviteId)
    const invite = inviteGateway.getInviteById(req.params.inviteId)

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
  (req: Request, res: Response) => {
    const inviteId = req.query.inviteId
    inviteGateway
      .deleteInvite(req.params.inviteId, inviteId)
      .then(invite => {
        res.send(invite)
      })
      .catch(err => res.status(404).send(err))
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
  (req: Request, res: Response) => {
    const invite = req.body
    inviteGateway
      .createInvite(invite)
      .then(savedInvite => {
        res.send(savedInvite)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
)

export default router
