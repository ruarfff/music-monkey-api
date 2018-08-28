import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import { searchTracks } from '../spotify/SpotifyClient'
import IUser from '../user/IUser'
const router = Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, query } = req
      const userData: IUser = user
      const searchTerm = query.q
      if (!searchTerm) {
        res.send([])
      } else {
        const { body } = await searchTracks(searchTerm, userData)
        res.send(body)
      }
    } catch (err) {
      logError('Error searching for tracks', err)
      const code = err && err.statusCode ? err.statusCode : 400
      res.status(code).send(err ? err.message : 'unknown error')
    }
  }
)

export default router
