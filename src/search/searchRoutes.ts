import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { IUser } from '../model'
import { searchTracks } from '../spotify/SpotifyClient'
const router = Router()

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
    searchTracks(searchTerm, userData)
      .then(({ body }: any) => {
        res.send(body)
      })
      .catch((err: any) => {
        const code = err && err.statusCode ? err.statusCode : 400
        res.status(code).send(err ? err.message : 'unknown error')
      })
  }
)

export default router
