import { expect } from 'chai'
import ITrack from '../spotify/ITrack'
import { findDuplicatedTracks } from './duplicateFinder'

describe('duplicateFinder', () => {
  test('it finds duplicates with same id', async () => {
    const tracks = findDuplicatedTracks([
      {
        id: '5iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 1'
      },
      {
        id: '1iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2'
      },
      {
        id: '1iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2'
      }
    ] as ITrack[])
    expect(tracks).to.deep.equal([
      {
        index: 2,
        reason: 'same-id',
        track: {
          artists: [{ name: 'Madonna' }],
          id: '1iufLITrEbQJRT7WR8Vrxl',
          name: 'Track 2'
        }
      }
    ])
  })

  test('it finds duplicates with same track name, artist and similar duration', async () => {
    const tracks = findDuplicatedTracks([
      {
        id: '5iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 1',
        duration_ms: 1000
      },
      {
        id: '2iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 1000
      },
      {
        id: '3iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 1000
      }
    ] as ITrack[])
    expect(tracks).to.deep.equal([
      {
        index: 2,
        reason: 'same-name-artist',
        track: {
          artists: [{ name: 'Madonna' }],
          duration_ms: 1000,
          id: '3iufLITrEbQJRT7WR8Vrxl',
          name: 'Track 2'
        }
      }
    ])
  })

  test('it finds duplicates with same track name and artist, and similar duration', async () => {
    const tracks = findDuplicatedTracks([
      {
        id: '5iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 1',
        duration_ms: 1000
      },
      {
        id: '2iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 1000
      },
      {
        id: '3iufLITrEbQJRT7WR8Vrxl',
        artists: [{ name: 'Madonna' }],
        name: 'Track 2',
        duration_ms: 2000
      }
    ] as ITrack[])
    expect(tracks).to.deep.equal([
      {
        index: 2,
        reason: 'same-name-artist',
        track: {
          artists: [{ name: 'Madonna' }],
          duration_ms: 2000,
          id: '3iufLITrEbQJRT7WR8Vrxl',
          name: 'Track 2'
        }
      }
    ])
  })
})
