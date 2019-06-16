import axios from 'axios'
import ISpotifyAuth from '../auth/ISpotifyAuth'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config'
import { logError, logInfo } from '../logging'
import IPlaylistParams from '../playlist/IPlaylistParams'
import IUser from '../user/model/IUser'
import { removeCachedUser, updateUser } from '../user/userService'
import ITrack from './ITrack'
import {
  cacheNewReleases,
  cachePlaylist,
  cacheRecommendations,
  cacheUserTopTracks,
  clearCachedPlaylist,
  getCachedNewReleases,
  getCachedPlaylist,
  getCachedRecommendations,
  getCachedUserTopTracks
} from './spotifyClientCache'
import { getCreds, saveCreds } from './spotifyCredsCache'

axios.defaults.headers.common.Authorization = `Basic ${Buffer.from(
  SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
).toString('base64')}`
import SpotifyWebApi from 'spotify-web-api-node'

export const getUserProfile = async (user: IUser) => {
  const validUser: IUser = await checkToken(user)
  console.log(validUser)
  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getMe()
  return body
}

export const getNewReleases = async (country: string, user: IUser) => {
  let newReleases = await getCachedNewReleases(country)
  console.log('Getting NR')
  if (newReleases) {
    console.log('Got cached new releases')
    return newReleases
  }
  try {
    const validUser: IUser = await checkToken(user)
    const { body } = await getSpotifyApi(
      validUser.spotifyAuth.accessToken
    ).getNewReleases({
      limit: 10,
      offset: 0,
      country
    })
    newReleases = body
    console.log('Caching NR', newReleases)
    cacheNewReleases(country, newReleases)
  } catch (err) {
    logError('Error getting new releases from Spotify', err)
  }
  return newReleases
}

export const getRecommendations = async (user: IUser) => {
  let recommendations = await getCachedRecommendations(user.userId)
  if (recommendations) {
    return recommendations
  }
  const seeds = ['alt_rock', 'blues', 'dance', 'hard_rock', 'hip_hop']
  const validUser: IUser = await checkToken(user)

  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getRecommendations({
    min_energy: 0.5,
    min_popularity: 50,
    seed_genres: seeds
  })

  recommendations = body.tracks
  cacheRecommendations(user.userId, recommendations)

  return recommendations
}

export const searchTracks = async (searchTerm: string, user: IUser) => {
  const validUser: IUser = await checkToken(user)
  console.log(searchTerm)
  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).searchTracks(searchTerm)

  return body
}

export const getUserTopTracks = async (user: IUser) => {
  let topTracks = await getCachedUserTopTracks(user.userId)

  if (topTracks) {
    return topTracks
  }

  const validUser: IUser = await checkToken(user)

  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getMyTopTracks()

  topTracks = body.items
  cacheUserTopTracks(user.userId, topTracks)

  return topTracks
}

export const getMultipleTracks = async (trackIds: string[], user: IUser) => {
  const validUser: IUser = await checkToken(user)
  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getTracks(trackIds)

  return body
}

export const getAudioFeaturesForTracks = async (
  user: IUser,
  trackIds: string[]
) => {
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  const { body } = await spotifyApi.getAudioFeaturesForTracks(trackIds)
  return body
}

export const createPlaylist = async (
  user: IUser,
  playlistParams: IPlaylistParams
) => {
  const name = playlistParams.name
  delete playlistParams.name
  const validUser: IUser = await checkToken(user)
  const api = getSpotifyApi(validUser.spotifyAuth.accessToken)

  const { body } = await api.createPlaylist(
    user.spotifyId,
    name,
    playlistParams
  )

  return body
}

export const getPlaylist = async (user: IUser, playlistId: string) => {
  let playlist = await getCachedPlaylist(playlistId)
  if (playlist) {
    return playlist
  }
  const validUser: IUser = await checkToken(user)
  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getPlaylist(playlistId)

  playlist = body
  cachePlaylist(playlistId, playlist)

  return playlist
}

export const getUserPlaylists = async (user: IUser, options: any) => {
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)

  const response = await spotifyApi.getUserPlaylists(
    validUser.spotifyId,
    options
  )

  const playlists = response.body.items.filter(
    (playlist: any) => playlist.owner.id === user.spotifyId
  )

  const playlistsWithTracks = await Promise.all(
    playlists.map(async (playlist: any) => {
      const { body } = await spotifyApi.getPlaylistTracks(playlist.id)
      const tracks = body.items

      return {
        ...playlist,
        tracks: { ...playlist.tracks, items: tracks }
      }
    })
  )

  return playlistsWithTracks
}

export const reorderTracksInPlaylist = async (
  user: IUser,
  playlistId: string,
  fromIndex: number,
  toIndex: number
) => {
  clearCachedPlaylist(playlistId)
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  let insertBefore = toIndex
  if (fromIndex < toIndex) {
    insertBefore++
  }
  const playlist = await spotifyApi.reorderTracksInPlaylist(
    playlistId,
    fromIndex,
    insertBefore
  )

  return playlist
}

export const editPlaylistDetails = async (
  user: IUser,
  playlistId: string,
  name: string,
  description: string
) => {
  clearCachedPlaylist(playlistId)
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  const { body } = await spotifyApi.changePlaylistDetails(playlistId, {
    name,
    description
  })
  return body
}

export const replaceTracksInPlaylist = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
  clearCachedPlaylist(playlistId)
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  const { body } = await spotifyApi.replaceTracksInPlaylist(
    playlistId,
    trackUris
  )
  return body
}

export const addTracksToPlaylist = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
  clearCachedPlaylist(playlistId)
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  const { body } = await spotifyApi.addTracksToPlaylist(playlistId, trackUris)
  return body
}

export const removeTracksFromPlaylistByPosition = async (
  user: IUser,
  playlistId: string,
  snapshotId: string,
  positions: number[]
) => {
  clearCachedPlaylist(playlistId)
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)

  const { body } = await spotifyApi.removeTracksFromPlaylistByPosition(
    playlistId,
    positions,
    snapshotId
  )

  return body
}

export const removeTracksFromPlaylist = async (
  user: IUser,
  playlistId: string,
  tracks: ITrack[]
) => {
  clearCachedPlaylist(playlistId)
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)

  const { body } = await spotifyApi.removeTracksFromPlaylist(playlistId, tracks)

  return body
}

export const removeTrackFromPlaylist = async (
  user: IUser,
  playlistId: string,
  track: ITrack
) => {
  return await removeTracksFromPlaylist(user, playlistId, [track])
}

async function checkToken(user: IUser) {
  if (!user.spotifyId || !user.spotifyAuth) {
    logInfo('Giving user app auth')
    return giveUserSpotifyAppCredential(user)
  }

  try {
    if (user.spotifyAuth.expiresAt < Date.now()) {
      logInfo('TOKEN Expired')
      const updatedUser = await refreshToken(user)
      logInfo('TOKEN Refreshed')

      return updatedUser
    }
  } catch (err) {
    logError(
      'Failed to refresh user token: ' + JSON.stringify(user, null, 4),
      err
    )
  }
  return user
}

async function giveUserSpotifyAppCredential(user: IUser) {
  let token: string
  let userWithAppCreds: IUser = user
  try {
    token = await getCreds()
    if (token) {
      userWithAppCreds = {
        ...user,
        spotifyAuth: {
          accessToken: token
        }
      } as IUser
    }
  } catch (err) {
    logError('Error giving user app creds for Spotify', err)
  }
  if (!token) {
    try {
      const creds = await getClientCreds()
      const freshToken = creds.accessToken
      saveCreds(freshToken)
      userWithAppCreds = {
        ...user,
        spotifyAuth: {
          accessToken: freshToken
        }
      } as IUser
    } catch (x) {
      console.log(x)
    }
  }
  return userWithAppCreds
}

async function getClientCreds() {
  const { data }: any = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      grant_type: 'client_credentials'
    }
  })

  const accessToken = data.access_token
  const expiresAt = Date.now() + data.expires_in * 1000
  const expiresIn = data.expires_in

  return {
    accessToken,
    expiresAt,
    expiresIn
  } as ISpotifyAuth
}

async function getRefreshedToken(userRefreshToken: string) {
  const { data }: any = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      grant_type: 'refresh_token',
      refresh_token: userRefreshToken
    }
  })

  const accessToken = data.access_token
  const expiresAt = Date.now() + data.expires_in * 1000
  const expiresIn = data.expires_in

  return {
    accessToken,
    expiresAt,
    expiresIn,
    refreshToken: userRefreshToken
  } as ISpotifyAuth
}

async function refreshToken(user: IUser) {
  logInfo('Refreshing token for  ' + user.userId)
  removeCachedUser(user.userId)
  const spotifyAuth = await getRefreshedToken(user.spotifyAuth.refreshToken)
  const updatedUser = await updateUser({ ...user, spotifyAuth })
  return updatedUser
}

function getSpotifyApi(token?: string) {
  const spotifyApi = new SpotifyWebApi({
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET
  })
  if (token) {
    spotifyApi.setAccessToken(token)
  }
  return spotifyApi
}
