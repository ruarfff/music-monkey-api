import { expect } from 'chai'
import { mocked } from 'ts-jest/utils'
import IUser from '../user/model/IUser'
import * as spotifyApiGateway from './spotifyApiGateway'
import * as cache from './spotifyClientCache'
jest.mock('./spotifyApiGateway')
jest.mock('./spotifyClientCache')
import * as spotifyClient from './spotifyClient'
import * as testData from './spotifyClientTestDataFixture'

const user = {
  displayName: 'test-user',
  email: 'test-user@email.com',
  userId: '1234',
  isGuest: true
} as IUser

it('should get new releases', async () => {
  mocked(spotifyApiGateway.getNewReleases).mockResolvedValue(
    testData.newReleases
  )
  mocked(cache.getCachedNewReleases).mockResolvedValue(null)

  const newReleases = await spotifyClient.getNewReleases('IE', user)
  expect(newReleases).to.eql(testData.newReleases)
})

it('should get recommendations', async () => {
  mocked(spotifyApiGateway.getRecommendations).mockResolvedValue(
    testData.recommendations
  )
  mocked(cache.getCachedRecommendations).mockResolvedValue(null)

  const recommendations = await spotifyClient.getRecommendations(user)
  expect(recommendations).to.eql(testData.recommendations)
})

it('should search tracks', async () => {
  mocked(spotifyApiGateway.searchTracks).mockResolvedValue(
    testData.searchResults
  )
  const searchResults = await spotifyClient.searchTracks('any', user)

  expect(searchResults).to.eql(testData.searchResults)
})

it('should get multiple tracks', async () => {
  mocked(spotifyApiGateway.getMultipleTracks).mockResolvedValue(
    testData.multipleTracks
  )
  const tracks = await spotifyClient.getMultipleTracks(
    ['4T5Z4mbTe7kuGqgLpaRtTh', '2DyHhPyCZgZzNXn1IrtsTu'],
    user
  )

  expect(tracks).to.eql(testData.multipleTracks)
})

it('should get audio features for a track', async () => {
  mocked(spotifyApiGateway.getAudioFeaturesForTracks).mockResolvedValue(
    testData.audioFeatures
  )
  const audioFeatures = await spotifyClient.getAudioFeaturesForTracks(user, [
    '4T5Z4mbTe7kuGqgLpaRtTh',
    '2DyHhPyCZgZzNXn1IrtsTu'
  ])

  expect(audioFeatures).to.eql(testData.audioFeatures)
})

it('should get a playlist by id', async () => {
  mocked(spotifyApiGateway.getPlaylist).mockResolvedValue(testData.playlist)
  const playlist = await spotifyClient.getPlaylist(
    user,
    '52PrRf8VFCsJr3oIl6FOaY'
  )

  expect(playlist).to.eql(testData.playlist)
})
