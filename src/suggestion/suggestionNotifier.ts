import { send } from '../notification'
import ISuggestion from './ISuggestion'

export const onSuggestionSaved = (
  eventId: string,
  suggestions: ISuggestion[]
) => {
  send('mm-suggestions-' + eventId, 'suggestion-saved', suggestions)
}

export const onSuggestionsAccepted = (
  eventId: string,
  suggestions: ISuggestion[]
) => {
  send('mm-suggestions-' + eventId, 'suggestions-accepted', suggestions)
}

export const onSuggestionsRejected = (
  eventId: string,
  suggestion: ISuggestion
) => {
  send('mm-suggestions-' + eventId, 'suggestions-rejected', [suggestion])
}
