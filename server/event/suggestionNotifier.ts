import { ISuggestion } from '../model'
const Pusher = require('pusher')

const pusher = new Pusher({
  appId: '536146',
  key: 'd7c284d8f17d26f74047',
  secret: 'b745eb542c9fc267ead7',
  cluster: 'eu',
  encrypted: true
})

export const onSuggectionSaved = (suggestion: ISuggestion) => {
  pusher.trigger('mm-suggestions-' + suggestion.eventId, 'suggestion-saved', suggestion)
}
