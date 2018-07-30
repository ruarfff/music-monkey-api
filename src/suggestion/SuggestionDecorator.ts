import { find, flatten, forOwn, groupBy } from 'lodash'
import * as spotifyUri from 'spotify-uri'
import { IUser } from '../model'
import IPlaylist from '../spotify/IPlaylist'
import ITrack from '../spotify/ITrack'
import SpotifyClient from '../spotify/SpotifyClient'
import ISuggestion from './ISuggestion'

export default class SuggestionDecorator {
  public decorateSuggestions = (suggestions: ISuggestion[], user: IUser) => {
    const spotifyClient = new SpotifyClient()
    const suggestionsGroupedByType = groupBy(suggestions, 'type')
    const trackSuggestionPromises = (suggestionsGroupedByType.track || [])
      .map(trackSuggestion => {
        const trackDetails = spotifyUri(trackSuggestion.trackUri)
        return spotifyClient
          .getTrack(trackDetails.id, user)
          .then((track: ITrack) => ({ suggestion: trackSuggestion, track }))
      })
      .map(p => p.catch((error: any) => error))

    const playlistSuggestionPromises: any[] = []

    if (suggestionsGroupedByType.playlist) {
      forOwn(
        groupBy(suggestionsGroupedByType.playlist, 'playlistUri'),
        (playlistSuggestions, playlistUri) => {
          const playlistDetails = spotifyUri(playlistUri)
          playlistSuggestionPromises.push(
            spotifyClient
              .getPlaylist(playlistDetails.user, playlistDetails.id, user)
              .then(({body}: any) => {
                const playlist: IPlaylist = body
                const decoratedSuggestions: any[] = []
                playlist.tracks.items.map(item => {
                  const matchingSuggestion = find(playlistSuggestions, {
                    trackUri: item.track.uri
                  })
                  if (matchingSuggestion) {
                    decoratedSuggestions.push({
                      suggestion: matchingSuggestion,
                      track: item.track
                    })
                  }
                })
                return decoratedSuggestions
              })
          )
        }
      )
    }
    return Promise.all([
      ...trackSuggestionPromises,
      ...playlistSuggestionPromises
    ])
      .then(values => values.filter(v => !(v instanceof Error)))
      .then(flatten)
  }
}
