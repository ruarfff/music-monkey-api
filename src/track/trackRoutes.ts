import { Request, Response, Router } from 'express'
import * as passport from 'passport'
import { logError } from '../logging'
import { getAudioFeaturesByTrackIds } from './trackService'
const router = Router()

/**
 * @swagger
 * /tracks/audio-features:
 *   get:
 *     tags:
 *       - track
 *     description: Get audio features for tracks
 *     summary: Get audio features for tracks
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of audio features
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/AudioFeature'
 */
router.get(
  '/audio-features',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user, query } = req
      const { trackUris } = query
      const audioFeatures = await getAudioFeaturesByTrackIds(
        user,
        trackUris.split(',')
      )
      res.send(audioFeatures)
    } catch (err) {
      logError('Failed to ger audio features for tracks', err, req)
      res.send([])
    }
  }
)

export default router
