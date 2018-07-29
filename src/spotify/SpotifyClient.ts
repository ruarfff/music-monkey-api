import { IUser } from '../model'
import UserGateway from '../user/UserGateway'
const SpotifyWebApi = require('spotify-web-api-node')
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19'
const userGateway: UserGateway = new UserGateway()
const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
})

export default class SpotifyClient {
  public getPlaylist(userName: string, playlistId: string, user: IUser) {
    return this.checkToken(user).then((validUser: IUser) => {
      spotifyApi.setAccessToken(validUser.spotifyAuth.accessToken)
      return spotifyApi.getPlaylist(userName, playlistId)
    })
  }

  public getUserPlaylists(user: IUser) {
    return this.checkToken(user).then((validUser: IUser) => {
      console.log('USER:', user)
      spotifyApi.setAccessToken(validUser.spotifyAuth.accessToken)

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

  private checkToken(user: IUser) {
    console.log(user.spotifyAuth.expiresAt)
    console.log(Date.now())
    if (user.spotifyAuth.expiresAt < Date.now()) {
      return this.refreshToken(user.spotifyAuth.refreshToken).then(
        (spotifyAuth: any) => {
          console.log('spotifyAuth', spotifyAuth)
          return userGateway.updateUser({ ...user, spotifyAuth })
        }
      )
    } else {
      return Promise.resolve(user)
    }
  }

  private refreshToken(refreshToken: string) {
    spotifyApi.setRefreshToken(refreshToken)

    return spotifyApi.refreshAccessToken().then((data: any) => {
      const accessToken = data.body.access_token
      const expiresAt = Date.now() + data.body.expires_in * 1000

      return { accessToken, expiresAt, refreshToken }
    })
  }
}
