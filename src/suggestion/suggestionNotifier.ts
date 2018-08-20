import { ISuggestion } from '../model'
import { send } from '../notification'

export const onSuggestionSaved = (suggestion: ISuggestion) => {
  send('mm-suggestions-' + suggestion.eventId, 'suggestion-saved', suggestion)
}

export const onSuggestionsAccepted = (eventId: string) => {
  send('mm-suggestions-' + eventId, 'suggestions-accepted')
}
