import IPlaylist from '../../spotify/IPlaylist'
import IEventGuest from './IEventGuest'
import IEventLocation from './IEventLocation'
import IEventSettings from './IEventSettings'
import IUser from '../../user/model/IUser';

export default interface IEvent {
  eventId: string
  userId: string
  organizer: string
  imageUrl: string
  name: string
  genre: string
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
  hostData: IUser
}
