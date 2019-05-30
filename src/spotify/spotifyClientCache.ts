import * as cache from '../cache'
import { logError } from '../logging'

const defaultCacheTTL = 600 * 24
const newReleaseKey = 'new-releases'
const recommendationKey = 'recommendations'
const userTopTrackKey = 'user-top-tracks'
const playlistKey = 'playlist'

export const cacheNewReleases = (country: string, newReleases: any) => {
  try {
    cache.setObject(`${newReleaseKey}-${country}`, newReleases, defaultCacheTTL)
  } catch (err) {
    logError('Error setting cached new releases', err)
  }
}

export const getCachedNewReleases = async (country: string) => {
  let newReleases
  try {
    newReleases = await cache.getObject(`${newReleaseKey}-${country}`)
  } catch (err) {
    logError('Error getting cached new releases', err)
  }
  return newReleases
}

export const cacheRecommendations = (userId: string, recommendations: any) => {
  try {
    cache.setObject(
      `${recommendationKey}-${userId}`,
      recommendations,
      defaultCacheTTL
    )
  } catch (err) {
    logError('Error setting cached recommendations', err)
  }
}

export const getCachedRecommendations = async (userId: string) => {
  let recommendations
  try {
    recommendations = await cache.getObject(`${recommendationKey}-${userId}`)
  } catch (err) {
    logError('Error getting cached new releases', err)
  }
  return recommendations
}

export const cacheUserTopTracks = (userId: string, topTracks: any) => {
  try {
    cache.setObject(`${userTopTrackKey}-${userId}`, topTracks, defaultCacheTTL)
  } catch (err) {
    logError('Error setting cached top tracks', err)
  }
}

export const getCachedUserTopTracks = async (userId: string) => {
  let topTracks
  try {
    topTracks = await cache.getObject(`${userTopTrackKey}-${userId}`)
  } catch (err) {
    logError('Error getting cached top tracks for user ' + userId, err)
  }
  return topTracks
}

export const cachePlaylist = (
  playlistId: string,
  playlist: any
) => {
  try {
    cache.setObject(
      `${playlistKey}-${playlistId}`,
      playlist,
      defaultCacheTTL
    )
  } catch (err) {
    logError('Error setting cached top tracks', err)
  }
}

export const getCachedPlaylist = async (playlistId: string) => {
  let playlist
  try {
    playlist = await cache.getObject(`${playlistKey}-${playlistId}`)
  } catch (err) {
    logError('Error getting cached playlist ', err)
  }
  return playlist
}

export const clearCachedPlaylist = (playlistId: string) => {
  try {
    cache.del(`${playlistKey}-${playlistId}`)
  } catch (err) {
    logError('Error deleting playlist from cache', err)
  }
}
