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
    let recommendationRequest
    if (userData.spotifyId) {
      recommendationRequest = spotifyClient.getUserTopTracks(userData)
    } else {
      const country = userData.country || 'US'
      recommendationRequest = spotifyClient.getRecommendations(userData)
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
