import { logError, logInfo } from '../logging'
import { ISpotifyAuth, IUser } from '../model'
import UserService from '../user/UserService'
import { getCreds, saveCreds } from './spotifyCredsCache'

const SpotifyWebApi = require('spotify-web-api-node')
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19'
const userService: UserService = new UserService()

const getSpotifyApi = (token?: string) => {
  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret
  })
  if (token) {
    spotifyApi.setAccessToken(token)
  }
  return spotifyApi
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

export const getTrack = async (trackId: string, user: IUser) => {
  const validUser: IUser = await checkToken(user)

  const { body } = await getSpotifyApi(
    validUser.spotifyAuth.accessToken
  ).getTrack(trackId)
  return body
}

export const getPlaylist = async (
  userName: string,
  playlistId: string,
  user: IUser
) => {
  const validUser: IUser = await checkToken(user)

  return getSpotifyApi(validUser.spotifyAuth.accessToken).getPlaylist(
    userName,
    playlistId
  )
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
      const { body } = await spotifyApi.getPlaylistTracks(
        playlist.owner.id,
        playlist.id
      )
      const tracks = body.items

      return {
        ...playlist,
        tracks: { ...playlist.tracks, items: tracks }
      }
    })
  )

  return playlistsWithTracks
}

async function checkToken(user: IUser) {
  logInfo('Checking token')
  if (!user.spotifyId && !user.spotifyAuth) {
    logInfo('Giving user app auth')
    return giveUserSpotifyAppCredential(user)
  }

  try {
    if (user.spotifyAuth.expiresAt < Date.now()) {
      logInfo('TOKEN Expired')
      logInfo('spotifyAuth ' + JSON.stringify(user.spotifyAuth, null, 4))
      const spotifyAuth = await refreshToken(
        user.spotifyAuth.accessToken,
        user.spotifyAuth.refreshToken
      )
      logInfo('Refreshed token ' + JSON.stringify(spotifyAuth))
      const updatedUser = await userService.updateUser({ ...user, spotifyAuth })
      logInfo('Updated user')
      return updatedUser
    }
  } catch (err) {
    logError('Failed to refresh user token ', err)
    return giveUserSpotifyAppCredential(user)
  }
  logInfo('Token probably OK')
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
    const { body } = await getSpotifyApi().clientCredentialsGrant()
    const freshToken = body.access_token
    saveCreds(freshToken)
    userWithAppCreds = {
      ...user,
      spotifyAuth: {
        accessToken: freshToken
      }
    } as IUser
  }
  return userWithAppCreds
}

async function refreshToken(oldAccessToken: string, userRefreshToken: string) {
  logInfo('Adding old access token: ' + oldAccessToken)
  logInfo('Adding refresh token: ' + userRefreshToken)
  const spotifyApi = getSpotifyApi(oldAccessToken)
  spotifyApi.setRefreshToken(userRefreshToken)

  const { body } = await spotifyApi.refreshAccessToken()
  const accessToken = body.access_token
  const expiresAt = Date.now() + body.expires_in * 1000

  return {
    accessToken,
    expiresAt,
    refreshToken: userRefreshToken
  } as ISpotifyAuth
}
