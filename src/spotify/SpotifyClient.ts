import { IUser } from '../model'
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

export const getNewReleases = (country: string, user: IUser) => {
  return checkToken(user).then((validUser: IUser) => {
    return getSpotifyApi(validUser.spotifyAuth.accessToken).getNewReleases({
      limit: 10,
      offset: 0,
      country
    })
  })
}

export const getRecommendations = (user: IUser) => {
  const seeds = ['alt_rock', 'blues', 'dance', 'hard_rock', 'hip_hop']
  return checkToken(user).then((validUser: IUser) => {
    return getSpotifyApi(validUser.spotifyAuth.accessToken)
      .getRecommendations({
        min_energy: 0.5,
        min_popularity: 50,
        seed_genres: seeds
      })
      .then(({ body }: any) => {
        return body.tracks
      })
      .catch((err: any) => {
        console.log(err)
      })
  })
}

export const searchTracks = (searchTerm: string, user: IUser) => {
  return checkToken(user).then((validUser: IUser) => {
    return getSpotifyApi(validUser.spotifyAuth.accessToken).searchTracks(
      searchTerm
    )
  })
}

export const getUserTopTracks = (user: IUser) => {
  return checkToken(user).then((validUser: IUser) => {
    return getSpotifyApi(validUser.spotifyAuth.accessToken)
      .getMyTopTracks()
      .then(({ body }: any) => {
        return body.items
      })
  })
}

export const getTrack = (trackId: string, user: IUser) => {
  return checkToken(user).then((validUser: IUser) => {
    return getSpotifyApi(validUser.spotifyAuth.accessToken)
      .getTrack(trackId)
      .then(({ body }: any) => body)
  })
}

export const getPlaylist = (
  userName: string,
  playlistId: string,
  user: IUser
) => {
  return checkToken(user).then((validUser: IUser) => {
    return getSpotifyApi(validUser.spotifyAuth.accessToken).getPlaylist(
      userName,
      playlistId
    )
  })
}

export const getUserPlaylists = (user: IUser) => {
  return checkToken(user).then((validUser: IUser) => {
    const spotifyApi = getSpotifyApi(validUser.spotifyAuth.accessToken)

    return spotifyApi
      .getUserPlaylists(validUser.spotifyId)
      .then((response: any) => {
        const playlists = response.body.items.filter(
          (playlist: any) => playlist.owner.id === user.spotifyId
        )

        const playlistsWithTracks = Promise.all(
          playlists.map(
            (playlist: any) =>
              new Promise((r, rej) => {
                spotifyApi
                  .getPlaylistTracks(playlist.owner.id, playlist.id)
                  .then((tracks: any) => {
                    r({
                      ...playlist,
                      tracks: { ...playlist.tracks, items: tracks.items }
                    })
                  })
                  .catch(rej)
              })
          )
        )
        return playlistsWithTracks
      })
  })
}

async function checkToken(user: IUser) {
  console.log('Checking token', JSON.stringify(user))
  if (!user.spotifyId && !user.spotifyAuth) {
    console.log('Giving user app auth')
    return giveUserSpotifyAppCredential(user)
  }

  try {
    if (user.spotifyAuth.expiresAt < Date.now()) {
      console.log('TOKEN Expired')
      const spotifyAuth = await refreshToken(
        user.spotifyAuth.accessToken,
        user.spotifyAuth.refreshToken
      )
      console.log('Refreshed token', spotifyAuth)
      const updatedUser = await userService.updateUser({ ...user, spotifyAuth })
      console.log('Updated user', updatedUser)
      return updatedUser
    }
  } catch (err) {
    console.error('Failed to refresh user token ', err)
    return giveUserSpotifyAppCredential(user)
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
    console.error(err)
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

function refreshToken(oldAccessToken: string, userRefreshToken: string) {
  const spotifyApi = getSpotifyApi(oldAccessToken)
  spotifyApi.setRefreshToken(userRefreshToken)

  return spotifyApi.refreshAccessToken().then((data: any) => {
    const accessToken = data.body.access_token
    const expiresAt = Date.now() + data.body.expires_in * 1000

    return { accessToken, expiresAt, userRefreshToken }
  })
}
