import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import IPlaylist from '../spotify/IPlaylist'
import IPlaylistParams from './IPlaylistParams'
import {
  addTracksToExistingPlaylist, changePlaylistDetails,
  createNewPlaylist,
  deleteSingleTrackFromPlaylist,
  getPlaylistById,
  reOrderPlaylist,
  replacePlaylistTracks
} from './playlistService'
const router = Router()

/**
 * @swagger
 * /playlists/{playlistId}:
 *   get:
 *     tags:
 *       - playlists
 *     description: Get a playlist by ID
 *     summary: Get a playlist by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A playlist
 *         schema:
 *           $ref: '#/definitions/Playlist'
 */
router.get(
  '/:playlistId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, params } = req
      const playlist: IPlaylist = await getPlaylistById(user, params.playlistId)
      res.send(playlist)
    } catch (err) {
      res.status(500).send(err ? err.message : 'An unknown error occurred.')
    }
  }
)

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

/**
 * @swagger
 * /playlists/{playlistId}/tracks:
 *   post:
 *     tags:
 *       - playlists
 *     description: Add tracks to an existing playlist
 *     summary: Add tracks to an existing playlist
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A playlist with tracks added
 */
router.post(
  '/:playlistId/tracks',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, body, params } = req
      const playlistId = params.playlistId
      let playlist: IPlaylist
      if (body.hasOwnProperty('trackUris')) {
        const { trackUris } = body
        await addTracksToExistingPlaylist(
          user,
          playlistId,
          trackUris
        )
      }
      playlist = await getPlaylistById(user, playlistId)
      if (!playlist) {
        res.status(400).send()
      } else {
        res.send(playlist)
      }
    } catch (err) {
      res.status(500).send(err ? err.message : 'An unexpected error occurred.')
    }
  }
)

/**
 * @swagger
 * /playlists/{playlistId}/tracks:
 *   put:
 *     tags:
 *       - playlists
 *     description: Add tracks to an existing playlist
 *     summary: Add tracks to an existing playlist
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A playlist with tracks added
 */
router.put(
  '/:playlistId/tracks',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, body, params } = req
      const playlistId = params.playlistId
      let playlist: IPlaylist
      if (body.hasOwnProperty('trackUris')) {
        const { trackUris } = body
        playlist = await replacePlaylistTracks(user, playlistId, trackUris)
      } else if (body.hasOwnProperty('fromIndex')) {
        const { fromIndex, toIndex } = body
        playlist = await reOrderPlaylist(
          user,
          playlistId,
          fromIndex,
          toIndex
        )
      }
      if (!playlist) {
        res.status(400).send()
      } else {
        res.send(playlist)
      }
    } catch (err) {
      res.status(500).send(err ? err.message : 'An unexpected error occurred.')
    }
  }
)

/**
 * @swagger
 * /playlists/{playlistId}:
 *   put:
 *     tags:
 *       - playlists
 *     description: Edit playlist details
 *     summary: Edit playlist details of an existing playlist
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Edit playlist details changed
 */
router.put(
  '/:playlistId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, body, params } = req
      const playlistId = params.playlistId
      const { name, description } = body
      let playlist: IPlaylist
      playlist = await changePlaylistDetails(user, playlistId, name, description)

      res.send(playlist)
    } catch (err) {
      res.status(500).send(err ? err.message : 'An unexpected error occurred.')
    }
  }
)

/**
 * @swagger
 * /playlists/{playlistId}/tracks:
 *   delete:
 *     tags:
 *       - playlists
 *     description: Delete a track from a playlist
 *     summary: Delete a track from a playlist
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Track was deleted
 */
router.delete(
  '/:playlistId/tracks',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, params, body } = req
      const { playlistId } = params
      const { tracks } = body

      await deleteSingleTrackFromPlaylist(
        user,
        playlistId,
        tracks[0]
      )
      const playlist: IPlaylist = await getPlaylistById(user, playlistId)
      res.send(playlist)
    } catch (err) {
      res.status(500).send(err ? err.message : 'An unexpected error occurred.')
    }
  }
)

export default router
