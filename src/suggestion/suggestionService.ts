import spotifyUri from 'spotify-uri'
import { getEventById } from '../event/eventGateway'
import { logError } from '../logging'
import { addTracksToExistingPlaylist } from '../playlist/playlistService'
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
  const savedSuggestions = await saveSuggestions(suggestions)
  handleSavedSuggestions(savedSuggestions)
  return savedSuggestions
}

export const createSuggestion = async (suggestion: ISuggestion) => {
  const savedSuggestion = await saveSuggestion(suggestion)
  handleSavedSuggestions([savedSuggestion])
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

async function handleSavedSuggestions(suggestions: ISuggestion[]) {
  let eventId
  try {
    const event = await getEventById(suggestions[0].eventId)
    eventId = event.eventId
    if (event.settings && event.settings.autoAcceptSuggestionsEnabled) {
      const user = await getUserById(event.userId)
      const playlistDetails = spotifyUri.parse(event.playlistUrl)
      const trackUris = suggestions.map(s => s.trackUri)
      await addTracksToExistingPlaylist(user, playlistDetails.id, trackUris)
      await onAutoAcceptedSuggestion(eventId)
      await acceptSuggestions(eventId, suggestions)
    } else {
      await onSuggestionSaved(eventId)
    }
  } catch (err) {
    logError(
      'An error ocurred during auto accept flow for event: ' + eventId,
      err
    )
  }
}
