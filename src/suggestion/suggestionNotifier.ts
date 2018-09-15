import { send } from '../notification'
import ISuggestion from './ISuggestion'

export const onSuggestionSaved = (suggestion: ISuggestion) => {
  send('mm-suggestions-' + suggestion.eventId, 'suggestion-saved', suggestion)
}

export const onSuggestionsAccepted = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestions-accepted', {})
}

export const onSuggestionsRejected = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestions-rejected', {})
}

export const onAutoAcceptedSuggestion = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestions-auto-accepted', {})
}
