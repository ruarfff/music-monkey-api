import { Request, Response, Router } from 'express'
import { isEmpty } from 'lodash'
import passport from 'passport'
import { logError } from '../logging'
import { getRecommendations, getUserTopTracks } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
const router = Router()

/**
 * @swagger
 * /recommendations:
 *   get:
 *     tags:
 *       - recommendations
 *     description: Get recommended tracks for a user
 *     summary: Get recommended tracks for a user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All a users recommendations
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/Track'
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      const userData: IUser = user
      let recommendations = []
      if (userData.spotifyId) {
        recommendations = await getUserTopTracks(userData)
      }

      if (isEmpty(recommendations)) {
        recommendations = await getRecommendations(userData)
      }

      res.send(recommendations)
    } catch (err) {
      logError('Failed to get recommendations', err, req)
      res.send([])
    }
  }
)

export default router
