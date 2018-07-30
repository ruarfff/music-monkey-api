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
    const { user, query } = req
    const userData: IUser = user
    const searchTerm = query.q
    if (!searchTerm) {
      res.send([])
    }
    if (userData.spotifyId) {
      spotifyClient
        .searchTracks(searchTerm, userData)
        .then(({body}: any) => {
          res.send(body)
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
