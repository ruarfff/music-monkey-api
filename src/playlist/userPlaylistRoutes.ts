import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { getUserPlaylists } from '../spotify/spotifyClient'
import IUser from '../user/IUser'
const router = Router()

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
