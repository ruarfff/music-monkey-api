import { expect } from 'chai'
import IUser from '../user/model/IUser'
import * as spotifyClient from './spotifyClient'
import SpotifyWebApi from 'spotify-web-api-node'
jest.mock('spotify-web-api-node')

const user = {
  displayName: 'test-user',
  email: 'test-user@email.com',
  userId: '1234',
  isGuest: true
} as IUser

beforeAll(() => {
  SpotifyWebApi.mockImplementation(() => ({}))
})
it('should get user profile', async () => {})

it('should get new releases', async () => {
  // const newReleases = await spotifyClient.getNewReleases('IE', user)
  // console.log(JSON.stringify(newReleases))
  // expect(newReleases).to.be.undefined
})

it('should get recommendations', async () => {
  // const recommendations = await spotifyClient.getRecommendations(user)
  // console.log(JSON.stringify(recommendations))
  // expect(recommendations).to.be.undefined
})

it('should search tracks', async () => {
  // const tracks = await spotifyClient.searchTracks('any', user)
  // console.log(JSON.stringify(tracks))
  // expect(tracks).to.exist
})

it('should get users top tracks', async () => {
  // const tracks = await spotifyClient.getUserTopTracks(user)
  // console.log(JSON.stringify(tracks))
  // expect(tracks).to.exist
})

it('should get multiple tracks', async () => {
  // const tracks = await spotifyClient.getMultipleTracks(
  //   ['4T5Z4mbTe7kuGqgLpaRtTh', '2DyHhPyCZgZzNXn1IrtsTu'],
  //   user
  // )
  // console.log(JSON.stringify(tracks))
  // expect(tracks).to.exist
})

it('should get audio features for a track', async () => {
  // const res = await spotifyClient.getAudioFeaturesForTracks(user, [
  //   '4T5Z4mbTe7kuGqgLpaRtTh',
  //   '2DyHhPyCZgZzNXn1IrtsTu'
  // ])
  // console.log(res)
  // expect(res).to.exist
})

it('should get a playlist by id', async () => {
  /** const res = await spotifyClient.getPlaylist(user, '52PrRf8VFCsJr3oIl6FOaY')
  console.log(JSON.stringify(res))
  expect(res).to.exist
  */
})

it('should get users playlists', async () => {
  // const res = await spotifyClient.getUserPlaylists(user, {
  //   limit: 1,
  //   offset: 0
  // })
  // console.log(JSON.stringify(res))
  // expect(res).to.exist
})

it('should get a playlist with tracks', async () => {})

it('should reorder tracks in playlist', async () => {})

it('should edit playlist details', async () => {})
