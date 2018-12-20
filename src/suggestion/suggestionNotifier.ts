import { send } from '../notification'

export const onSuggestionSaved = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestion-saved', {})
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
