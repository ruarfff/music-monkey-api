import spotifyUri from 'spotify-uri'
import { getEventById } from '../event/eventGateway'
import { logError } from '../logging'
import {
  addTracksToExistingPlaylist,
  deleteSingleTrackFromPlaylist
} from '../playlist/playlistService'
import ITrack from '../spotify/ITrack'
import { getUserById } from '../user/userService'
import ISuggestion from './ISuggestion'
import {
  destroySuggestion,
  fetchSuggestionById,
  fetchSuggestionsByEventId,
  fetchSuggestionsByUserId,
  fetchSuggestionsByUserIdAndEventId,
  saveSuggestion,
  saveSuggestionAsAccepted,
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
  await addManySuggestionToPlaylist(suggestions)
  onSuggestionsAccepted(eventId)
  return acceptedSuggestions
}

async function addManySuggestionToPlaylist(suggestions: ISuggestion[]) {
  const event = await getEventById(suggestions[0].eventId)
  const user = await getUserById(event.userId)
  const playlistDetails = spotifyUri.parse(event.playlistUrl)
  return await addTracksToExistingPlaylist(
    user,
    playlistDetails.id,
    suggestions.map(s => s.trackUri)
  )
}

export const acceptSuggestion = async (suggestionId: string) => {
  const acceptedSuggestion: ISuggestion = await saveSuggestionAsAccepted(
    suggestionId
  )
  await addSuggestionToPlaylist(acceptedSuggestion)
  onSuggestionsAccepted(acceptedSuggestion.eventId)
  return acceptedSuggestion
}

async function addSuggestionToPlaylist(suggestion: ISuggestion) {
  const event = await getEventById(suggestion.eventId)
  const user = await getUserById(event.userId)
  const playlistDetails = spotifyUri.parse(event.playlistUrl)
  return await addTracksToExistingPlaylist(user, playlistDetails.id, [
    suggestion.trackUri
  ])
}

export const rejectSuggestion = async (suggestionId: string) => {
  const suggestion = await fetchSuggestionById(suggestionId)
  if (suggestion.accepted) {
    await deleteSuggestionFromPlaylist(suggestion)
  }
  const rejectedSuggestion = await saveSuggestionAsRejected(suggestion)
  onSuggestionsRejected(rejectedSuggestion.eventId)
  return rejectedSuggestion
}

async function deleteSuggestionFromPlaylist(suggestion: ISuggestion) {
  try {
    const event = await getEventById(suggestion.eventId)
    const user = await getUserById(event.userId)
    const playlistDetails = spotifyUri.parse(event.playlistUrl)

    await deleteSingleTrackFromPlaylist(user, playlistDetails.id, {
      uri: suggestion.trackUri
    } as ITrack)
  } catch (err) {
    console.error(err)
  }
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
      console.log('Auto Accepting suggestion')
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
