import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { IUser } from '../model'
import { getRecommendations, getUserTopTracks } from '../spotify/SpotifyClient'
const router = Router()

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
