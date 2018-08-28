import { flatten, groupBy } from 'lodash'
import * as spotifyUri from 'spotify-uri'
import { logError } from '../logging'
import { getTrack } from '../spotify/SpotifyClient'
import IUser from '../user/IUser'
import UserGateway from '../user/UserGateway'
import IDecoratedSuggestion from './IDecoratedSuggestion'
import ISuggestion from './ISuggestion'

const userGateway: UserGateway = new UserGateway()

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
          const user = await userGateway.getUserById(userId)
          return groupedByUserId[userId].map(
            (decoratedSuggestion: IDecoratedSuggestion) => ({
              ...decoratedSuggestion,
              user
            })
          )
        } catch (err) {
          logError(err)
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
      const suggestionTrackDecorations = await Promise.all(
        suggestions.map(async (suggestion: ISuggestion) => {
          try {
            const trackDetails = spotifyUri(suggestion.trackUri)
            const track = await getTrack(trackDetails.id, user)

            return {
              suggestion,
              track
            } as IDecoratedSuggestion
          } catch (err) {
            logError(err)
          }
        })
      )
      return suggestionTrackDecorations
    } catch (err) {
      logError(err)
      return []
    }
  }
}
