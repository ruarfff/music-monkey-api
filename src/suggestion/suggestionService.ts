import * as spotifyUri from 'spotify-uri'
import { getEventById } from '../event/eventGateway'
import { logError } from '../logging'
import { addTracksToPlaylist } from '../spotify/spotifyClient'
import { getUserById } from '../user/userService'
import ISuggestion from './ISuggestion'
import {
  destroySuggestion,
  fetchSuggestionById,
  fetchSuggestionsByEventId,
  fetchSuggestionsByUserId,
  fetchSuggestionsByUserIdAndEventId,
  saveSuggestion,
  saveSuggestionAsRejected,
  saveSuggestions,
  saveSuggestionsAsAccepted
} from './suggestionGateway'
import {
  onAutoAcceptedSuggestion,
  onSuggestionsAccepted,
  onSuggestionSaved,
  onSuggestionsRejected
} from './suggestionNotifier'

export const createSuggestions = async (suggestions: ISuggestion[]) => {
  const suggestionModel = await saveSuggestions(suggestions)
  onSuggestionSaved(suggestionModel)
  handleAutoAcceptSuggestions(suggestions)
  return suggestionModel
}

export const createSuggestion = async (suggestion: ISuggestion) => {
  const savedSuggestion = await saveSuggestion(suggestion)
  onSuggestionSaved(savedSuggestion)
  handleAutoAcceptSuggestions([suggestion])
  return savedSuggestion
}

export const acceptSuggestions = async (
  eventId: string,
  suggestions: ISuggestion[]
) => {
  const acceptedSuggestions: ISuggestion[] = await saveSuggestionsAsAccepted(
    suggestions
  )
  onSuggestionsAccepted(eventId)
  return acceptedSuggestions
}

export const rejectSuggestion = async (suggestionId: string) => {
  const suggestion = await saveSuggestionAsRejected(suggestionId)
  onSuggestionsRejected(suggestion.eventId)
  return suggestion
}

export const deleteSuggestion = async (
  suggestionId: string,
  eventId: string
) => {
  return await destroySuggestion(suggestionId, eventId)
}

export const getSuggestionById = async (suggestionId: string) => {
  return await fetchSuggestionById(suggestionId)
}

export const getSuggestionsByEventId = async (eventId: string) => {
  return await fetchSuggestionsByEventId(eventId)
}

export const getSuggestionsByUserIdAndEventId = async (
  userId: string,
  eventId: string
) => {
  return await fetchSuggestionsByUserIdAndEventId(userId, eventId)
}

export const getSuggestionsByUserId = async (userId: string) => {
  return await fetchSuggestionsByUserId(userId)
}

async function handleAutoAcceptSuggestions(suggestions: ISuggestion[]) {
  let eventId
  try {
    const event = await getEventById(suggestions[0].eventId)
    eventId = event.eventId
    if (event.settings && event.settings.autoAcceptSuggestionsEnabled) {
      const user = await getUserById(event.userId)
      const playlistDetails = spotifyUri.parse(event.playlistUrl)
      const trackUris = suggestions.map(s => s.trackUri)
      addTracksToPlaylist(user, playlistDetails.id, trackUris)
      onAutoAcceptedSuggestion(eventId)
      acceptSuggestions(eventId, suggestions)
    }
  } catch (err) {
    logError(
      'An error ocurred during auto accept flow for event: ' + eventId,
      err
    )
  }
}
