import { logError } from '../logging'
import { getPlaylistById } from '../playlist/playlistService'
import IPlaylist from '../spotify/IPlaylist'
import IPlaylistQuery from '../spotify/IPlaylistQuery'
import parsePlaylistUrl from '../spotify/parsePlaylistUrl'
import IUser from '../user/model/IUser'
import { getEventGuests } from './eventGateway'
import {getSafeUserById} from '../user/userService'
import IEvent from './model/IEvent'

const defaultEventImage = '/img/partycover-sm.png'

export default class EventDecorator {
  public decorateEvents = (events: IEvent[], user: IUser) => {
    return Promise.all(events.map(event => this.decorateEvent(event, user)))
  }

  public decorateEvent = async (event: IEvent, user: IUser) => {
    let decoratedEvent: IEvent = await this.decorateEventWithPlaylist(
      event,
      user
    )
    decoratedEvent = await this.decorateEventWithGuests(decoratedEvent)
    decoratedEvent = await this.decorateEventWithHost(decoratedEvent)
    return decoratedEvent
  }

  public decorateSingleEvent = (event: IEvent, user: IUser) => {
    return this.decorateEvent(event, user)
  }

  public getEventPlaylist = (event: IEvent, user: IUser) => {
    const playlistQuery: IPlaylistQuery | undefined = parsePlaylistUrl(
      event.playlistUrl
    )

    if (playlistQuery) {
      return getPlaylistById(user, playlistQuery.playlistId)
    } else {
      return Promise.reject(new Error('Invalid Playlist Url'))
    }
  }

  private decorateEventWithPlaylist = async (event: IEvent, user: IUser) => {
    try {
      const playlist: IPlaylist = await this.getEventPlaylist(event, user)
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
    return event
  }

  private decorateEventWithHost = async(event: IEvent) => {
    try {
      const hostData = await getSafeUserById(event.userId)
      return {...event, hostData}as IEvent
    } catch (err) {
      logError('Error decorating event with host', err)
    }
    return event
  }
}
