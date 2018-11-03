import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import IPlaylist from '../spotify/IPlaylist'
import IPlaylistParams from './IPlaylistParams'
import { createNewPlaylist } from './playlistService'
const router = Router()

/**
 * @swagger
 * /playlists:
 *   post:
 *     tags:
 *       - playlists
 *     description: Create a playlist
 *     summary: Create a playlist
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A saved playlist
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, body } = req
      const playlistParams: IPlaylistParams = body
      const playlist: IPlaylist = await createNewPlaylist(user, playlistParams)
      res.send(playlist)
    } catch (err) {
      res.status(500).send(err ? err.message : 'An unexpected error occurred.')
    }
  }
)

export default router
