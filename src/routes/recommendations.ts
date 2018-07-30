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
    const userData: IUser = user
    if (userData.spotifyId) {
      spotifyClient
        .getUserTopTracks(userData)
        .then(({ body }: any) => {
          if (body) {
            res.send(body.items)
          } else {
            res.send([])
          }
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
