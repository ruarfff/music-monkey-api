import { flatten, groupBy, reduce } from 'lodash'
import * as spotifyUri from 'spotify-uri'
import { logError } from '../logging'
import ITrack from '../spotify/ITrack'
import { getMultipleTracks } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
import { getUserById } from '../user/userService'
import IDecoratedSuggestion from './IDecoratedSuggestion'
import ISuggestion from './ISuggestion'

export default class SuggestionDecorator {
  public decorateSuggestions = async (
    suggestions: ISuggestion[],
    user: IUser
  ) => {
    let decoratedSuggestions: IDecoratedSuggestion[]
    decoratedSuggestions = await this.decorateSuggestionsWithTracks(
      suggestions,
      user
    )

    decoratedSuggestions = await this.decorateSuggestionsWithUsers(
      decoratedSuggestions
    )
    return decoratedSuggestions
  }

  private decorateSuggestionsWithUsers = async (
    suggestions: IDecoratedSuggestion[]
  ): Promise<IDecoratedSuggestion[]> => {
    const groupedByUserId: any = groupBy(suggestions, 'suggestion.userId')
    const suggestionsWithUsers: any = await Promise.all(
      Object.keys(groupedByUserId).map(async (userId: string) => {
        try {
          const user = await getUserById(userId)
          return groupedByUserId[userId].map(
            (decoratedSuggestion: IDecoratedSuggestion) => ({
              ...decoratedSuggestion,
              user
            })
          )
        } catch (err) {
          logError('Error getting user for suggestion decoration', err)
          return []
        }
      })
    )

    return flatten(suggestionsWithUsers)
  }

  private decorateSuggestionsWithTracks = async (
    suggestions: ISuggestion[],
    user: IUser
  ): Promise<IDecoratedSuggestion[]> => {
    try {
      if (suggestions && suggestions.length < 1) {
        return []
      }
      let allTracks: ITrack[] = []
      const trackIds = suggestions
        .map((suggestion: ISuggestion) => {
          if (suggestion && suggestion.trackUri) {
            const trackDetails = spotifyUri(suggestion.trackUri)
            return trackDetails.id
          }
          return null
        })
        .filter(x => x !== null)
      if (trackIds.length <= 50) {
        const { tracks } = await getMultipleTracks(trackIds, user)
        allTracks = tracks
      } else {
        const chunk = 50
        let i
        let j
        let chunkedTrackIds
        for (i = 0, j = trackIds.length; i < j; i += chunk) {
          chunkedTrackIds = trackIds.slice(i, i + chunk)
          const { tracks } = await getMultipleTracks(chunkedTrackIds, user)
          allTracks = [...allTracks, ...tracks]
        }
      }
      const trackMap: any = reduce(
        allTracks,
        (acc, track) => ({ ...acc, [track.id]: track as ITrack }),
        {}
      )
      return suggestions.map((suggestion: ISuggestion) => {
        const trackDetails = spotifyUri(suggestion.trackUri)
        const track: ITrack = trackMap[trackDetails.id]
        return {
          suggestion,
          track
        } as IDecoratedSuggestion
      })
    } catch (err) {
      logError('Error decorating all suggestions with tracks', err)
      return []
    }
  }
}
