import cache from '../cache'
import { logError } from '../logging'
import ITrack from './ITrack'

const defaultCacheTTL = 600 * 24

const trackKey = 'tracks'

export const cacheTrack = (track: ITrack) => {
  try {
    cache.setObject(`${trackKey}-${track.id}`, track, defaultCacheTTL)
  } catch (err) {
    logError('Error setting cached track', err)
  }
}

export const getCachedTrack = async (trackId: string) => {
  let track
  try {
    track = await cache.getObject(`${trackKey}-${trackId}`)
  } catch (ignore) {}
  return track
}
