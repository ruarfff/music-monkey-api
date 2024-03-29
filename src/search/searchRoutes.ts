import { Request, Response, Router } from 'express'
import passport from 'passport'
import { logError } from '../logging'
import { searchTracks } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
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
      if (!searchTerm || !userData) {
        res.send([])
        return
      }
      const tracks = await searchTracks(searchTerm, userData)
      res.send(tracks)
    } catch (err) {
      logError('Error searching for tracks', err, req)
      const code = err && err.statusCode ? err.statusCode : 400
      res.status(code).send(err ? err.message : 'unknown error')
    }
  }
)

export default router
