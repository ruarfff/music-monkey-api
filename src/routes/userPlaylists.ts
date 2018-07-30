import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { IUser } from '../model'
import SpotifyClient from '../spotify/SpotifyClient'
const router = Router()
const spotifyClient = new SpotifyClient()

router.get(
  '/:userId/playlists',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    const { user } = req
    const userData: IUser = user

    console.log('userData.userId', userData.userId)
    console.log('req.params.userId', req.params)
    if (req.params.userId !== userData.userId) {
      res.status(401).send('Wrong User')
    } else if (userData.spotifyId) {
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
