import IPlaylist from '../spotify/IPlaylist'
import IEventGuest from './IEventGuest'
import IEventLocation from './IEventLocation'
import IEventSettings from './IEventSettings'

export default interface IEvent {
  eventId: string
  userId: string
  organizer: string
  imageUrl: string
  name: string
  description: string
  venue: string
  location: IEventLocation
  startDateTime: string
  endDateTime: string
  eventCode: string
  playlist: IPlaylist
  playlistUrl: string
  invites: string[]
  guests: IEventGuest[]
  settings: IEventSettings
}
