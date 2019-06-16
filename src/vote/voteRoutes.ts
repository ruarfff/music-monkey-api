import { Request, Response, Router } from 'express'
import passport from 'passport'
import { logError } from '../logging'
import { createVote, deleteVote } from './voteGateway'

const router = Router()

/**
 * @swagger
 * /votes:
 *   post:
 *     tags:
 *       - votes
 *     description: Create a new vote
 *     summary: Create a new vote
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Vote'
 *     responses:
 *       200:
 *         description: A vote
 *         schema:
 *           $ref: '#/definitions/Vote'
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const vote = await createVote(req.body)
      res.send(vote)
    } catch (err) {
      logError('Error creating vote', err, req)
      res.status(404).send(err)
    }
  }
)

/**
 * @swagger
 * /votes/{voteId}:
 *   delete:
 *     tags:
 *       - votes
 *     description: Delete a vote
 *     summary: Delete a vote
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Vote was deleted
 */
router.delete(
  '/:voteId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      await deleteVote(req.params.voteId)
      res.status(200).send()
    } catch (err) {
      logError('Failed to delete vote', err, req)
      res.status(400).send(err)
    }
  }
)

export default router
