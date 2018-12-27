import axios from 'axios'
import fetch from 'node-fetch'
import ISpotifyAuth from '../auth/ISpotifyAuth'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config'
import { logError, logInfo } from '../logging'
import IPlaylistParams from '../playlist/IPlaylistParams'
import IUser from '../user/model/IUser'
import { removeCachedUser, updateUser } from '../user/userService'
import ITrack from './ITrack'
import { getCreds, saveCreds } from './spotifyCredsCache'

axios.defaults.headers.common.Authorization = `Basic ${Buffer.from(
  SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
).toString('base64')}`
const SpotifyWebApi = require('spotify-web-api-node')

export const getUserProfile = async (user: IUser) => {
  const validUser: IUser = await checkToken(user)
  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getMe()
  return body
}

export const getNewReleases = async (country: string, user: IUser) => {
  const validUser: IUser = await checkToken(user)

  return getSpotifyApi(validUser.spotifyAuth.accessToken).getNewReleases({
    limit: 10,
    offset: 0,
    country
  })
}

export const getRecommendations = async (user: IUser) => {
  const seeds = ['alt_rock', 'blues', 'dance', 'hard_rock', 'hip_hop']
  const validUser: IUser = await checkToken(user)

  try {
    const { body } = await getSpotifyApi(
      validUser.spotifyAuth.accessToken
    ).getRecommendations({
      min_energy: 0.5,
      min_popularity: 50,
      seed_genres: seeds
    })

    return body.tracks
  } catch (err) {
    logError('Error getting recommendations', err)
  }
}

export const searchTracks = async (searchTerm: string, user: IUser) => {
  const validUser: IUser = await checkToken(user)

  return getSpotifyApi(validUser.spotifyAuth.accessToken).searchTracks(
    searchTerm
  )
}

export const getUserTopTracks = async (user: IUser) => {
  const validUser: IUser = await checkToken(user)

  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getMyTopTracks()

  return body.items
}

export const getMultipleTracks = async (trackIds: string[], user: IUser) => {
  const validUser: IUser = await checkToken(user)
  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getTracks(trackIds)

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

  try {
    return await api.createPlaylist(user.spotifyId, name, playlistParams)
  } catch (err) {
    throw err
  }
}

export const getPlaylist = async (user: IUser, playlistId: string) => {
  const validUser: IUser = await checkToken(user)
  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getPlaylist(playlistId)

  return body
}

export const getUserPlaylists = async (user: IUser) => {
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)

  const response = await spotifyApi.getUserPlaylists(validUser.spotifyId)

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
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  let insertBefore = toIndex
  if (fromIndex < toIndex) {
    insertBefore++
  }
  return await spotifyApi.reorderTracksInPlaylist(
    playlistId,
    fromIndex,
    insertBefore
  )
}

export const replaceTracksInPlaylist = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
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
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  const { body } = await spotifyApi.addTracksToPlaylist(playlistId, trackUris)
  return body
}

export const removeTrackFromPlaylist = async (
  user: IUser,
  playlistId: string,
  track: ITrack
) => {
  const validUser: IUser = await checkToken(user)
  const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)

  const { body } = await spotifyApi.removeTracksFromPlaylist(playlistId, [
    track
  ])

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

export const uploadNewImageForPlaylist = async (
  user: IUser,
  playlistId: string,
  image: string
) => {
  const validUser: IUser = await checkToken(user)
  let res
  try {
    res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/images`,
      {
        method: 'PUT',
        headers: {
          "scopes": 'ugc-image-upload granted playlist-modify-private',
          'Content-Type': 'image/jpeg',
          "token_type": 'Bearer',
          "access_token": `${validUser.spotifyAuth.accessToken}`
        },
        body: image
      }
    )
  } catch (e) {
    res = e
  }
  console.log(res)
  return res
  // const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)
  // await spotifyApi.uploadCustomPlaylistCoverImage(playlistId, image)
  //   .then(() => {
  //      console.log('Playlsit cover image uploaded!')
  //   }, (err: Error) => {
  //     console.log('Something went wrong!', err)
  //   })
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
