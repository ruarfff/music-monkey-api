import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import { createVote, deleteVote } from './voteGateway'

const router = Router()

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
