import { find, flatten, forOwn, groupBy } from 'lodash'
import * as spotifyUri from 'spotify-uri'
import { logError } from '../logging'
import { ISuggestion } from '../model'
import IPlaylist from '../spotify/IPlaylist'
import ITrack from '../spotify/ITrack'
import { getPlaylist, getTrack } from '../spotify/SpotifyClient'
import IUser from '../user/IUser'

export default class SuggestionDecorator {
  public decorateSuggestions = (suggestions: ISuggestion[], user: IUser) => {
    const suggestionsGroupedByType = groupBy(suggestions, 'type')
    const trackSuggestionPromises = (suggestionsGroupedByType.track || [])
      .map(trackSuggestion => {
        const trackDetails = spotifyUri(trackSuggestion.trackUri)
        return getTrack(trackDetails.id, user).then((track: ITrack) => {
          return {
            suggestion: trackSuggestion,
            track
          }
        })
      })
      .map(p =>
        p.catch((error: any) => {
          logError('Error decorating suggestion', error)
        })
      )

    const playlistSuggestionPromises: any[] = []

    if (suggestionsGroupedByType.playlist) {
      forOwn(
        groupBy(suggestionsGroupedByType.playlist, 'playlistUri'),
        (playlistSuggestions, playlistUri) => {
          const playlistDetails = spotifyUri(playlistUri)
          playlistSuggestionPromises.push(
            getPlaylist(playlistDetails.user, playlistDetails.id, user)
              .then(({ body }: any) => {
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
              .catch((err: any) => {
                logError(
                  'Error getting playlist during suggestion decoration',
                  err
                )
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
