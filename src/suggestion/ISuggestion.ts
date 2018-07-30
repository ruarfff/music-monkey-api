export default interface ISuggestion {
  suggestionId?: string
  eventId: string
  userId: string
  type: string
  trackUri: string
  playlistUri?: string
  accepted: boolean
}
