import { send } from '../notification'
import ISuggestion from './ISuggestion'

export const onSuggestionSaved = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestion-saved', {})
}

export const onSuggestionsAccepted = (
  eventId: string,
  suggestions: ISuggestion[]
) => {
  send('mm-suggestions-' + eventId, 'suggestions-accepted', suggestions)
}

export const onSuggestionsRejected = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestions-rejected', {})
}

export const onAutoAcceptedSuggestion = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestions-auto-accepted', {})
}
