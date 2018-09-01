import { logError } from '../logging'
import IPlaylist from '../spotify/IPlaylist'
import IPlaylistQuery from '../spotify/IPlaylistQuery'
import parsePlaylistUrl from '../spotify/parsePlaylistUrl'
import { getPlaylist } from '../spotify/SpotifyClient'
import IUser from '../user/IUser'
import { getEventGuests } from './eventGateway'
import IEvent from './IEvent'

const defaultEventImage = '/img/partycover-sm.png'

export default class EventDecorator {
  public decorateEvents = (events: IEvent[], user: IUser) => {
    return Promise.all(events.map(event => this.decorateEvent(event, user)))
  }

  public decorateSingleEvent = (event: IEvent, user: IUser) => {
    return this.decorateEvent(event, user)
  }

  public getEventPlaylist = (event: IEvent, user: IUser) => {
    const playlistQuery: IPlaylistQuery | undefined = parsePlaylistUrl(
      event.playlistUrl
    )

    if (playlistQuery) {
      return getPlaylist(playlistQuery.userName, playlistQuery.playlistId, user)
    } else {
      return Promise.reject(new Error('Invalid Playlist Url'))
    }
  }

  private decorateEvent = async (event: IEvent, user: IUser) => {
    let decoratedEvent: IEvent = await this.decorateEventWithPlaylist(
      event,
      user
    )
    decoratedEvent = await this.decorateEventWithGuests(decoratedEvent)
    return decoratedEvent
  }

  private decorateEventWithPlaylist = async (event: IEvent, user: IUser) => {
    try {
      const { body } = await this.getEventPlaylist(event, user)
      const playlist: IPlaylist = body
      let imageUrl = event.imageUrl

      if (!imageUrl) {
        imageUrl =
          playlist.images && playlist.images.length > 0
            ? playlist.images[0].url
            : defaultEventImage
      }
      const decoratedEvent: IEvent = {
        ...event,
        imageUrl,
        playlist
      }

      return decoratedEvent
    } catch (err) {
      logError('Error decorating event', err)
      return {
        ...event,
        imageUrl: event.imageUrl ? event.imageUrl : defaultEventImage
      }
    }
  }

  private decorateEventWithGuests = async (event: IEvent) => {
    try {
      const guests = await getEventGuests(event.eventId)
      return { ...event, guests } as IEvent
    } catch (err) {
      logError('Error decorating event with guests', err)
    }
    return { ...event }
  }
}
