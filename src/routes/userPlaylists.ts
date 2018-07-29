import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { IUser } from '../model'
import SpotifyClient from '../spotify/SpotifyClient'
const router = Router()
const spotifyClient = new SpotifyClient()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    const userData: IUser = user.user
    if (req.params.userId !== user.userId) {
      res.status(401).send()
    }
    if (userData.spotifyId) {
      spotifyClient
        .getUserPlaylists(userData)
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
