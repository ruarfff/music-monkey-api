import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getRecommendations, getUserTopTracks } from '../spotify/spotifyClient'
import IUser from '../user/IUser'
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
  (req: Request, res: Response) => {
    const { user } = req
    const userData: IUser = user
    let recommendationRequest
    if (userData.spotifyId) {
      recommendationRequest = getUserTopTracks(userData)
    } else {
      recommendationRequest = getRecommendations(userData)
    }

    recommendationRequest
      .then((tracks: any) => {
        if (tracks) {
          res.send(tracks)
        } else {
          res.send([])
        }
      })
      .catch((err: any) => {
        const code = err.statusCode || 400
        res.status(code).send(err.message)
      })
  }
)

export default router
