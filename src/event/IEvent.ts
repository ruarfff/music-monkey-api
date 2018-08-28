import IPlaylist from '../spotify/IPlaylist'
import IEventGuest from './IEventGuest'
import IEventLocation from './IEventLocation'

export default interface IEvent {
  eventId: string
  usrId: string
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
}
