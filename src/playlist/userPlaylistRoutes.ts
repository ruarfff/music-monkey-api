import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getUserPlaylists } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
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
    const { user } = req
    const userData: IUser = user

    if (req.params.userId !== userData.userId) {
      res.status(401).send('Wrong User')
    } else if (userData.spotifyId) {
      getUserPlaylists(userData)
        .then((playlists: any) => {
          res.send(playlists)
        })
        .catch((err: any) => {
          const code = err.statusCode || 400
          res.status(code).send(err.message)
        })
    } else {
      res.send([])
    }
  }
)

export default router
