import { Request, Response, Router } from 'express'
import passport from 'passport'
import { getUserPlaylists } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
import { logError } from '../logging'
const router = Router()

/**
 * @swagger
 * /users/{userId}/playlists:
 *   get:
 *     tags:
 *       - playlists
 *     description: Get a users playlists
 *     summary: Get a users playlists
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All a users playlists
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/Playlist'
 */
router.get(
  '/:userId/playlists',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user, query } = req
    const { limit, offset } = query
    const userData: IUser = user

    if (req.params.userId !== userData.userId) {
      res.status(401).send('Wrong User')
    } else if (userData.spotifyId) {
      getUserPlaylists(userData, { limit, offset })
        .then((playlists: any) => {
          res.send(playlists)
        })
        .catch((err: any) => {
          logError(err)
          const code = err.statusCode || 400
          res.status(code).send(err.message)
        })
    } else {
      res.send([])
    }
  }
)

export default router
