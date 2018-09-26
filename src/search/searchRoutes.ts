import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import { searchTracks } from '../spotify/spotifyClient'
import IUser from '../user/IUser'
const router = Router()

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - search
 *     description: Search for a track
 *     summary: Search for a track
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Term used to search for tracks
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An event
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
      const { user, query } = req
      const userData: IUser = user
      const searchTerm = query.q
      if (!searchTerm) {
        res.send([])
      } else {
        const { body } = await searchTracks(searchTerm, userData)
        res.send(body)
      }
    } catch (err) {
      logError('Error searching for tracks', err, req)
      const code = err && err.statusCode ? err.statusCode : 400
      res.status(code).send(err ? err.message : 'unknown error')
    }
  }
)

export default router
