import { IEvent, IUser } from '../model'
import IPlaylist from '../spotify/IPlaylist'
import IPlaylistQuery from '../spotify/IPlaylistQuery'
import parsePlaylistUrl from '../spotify/parsePlaylistUrl'
import SpotifyClient from '../spotify/SpotifyClient'

const defaultEventImage = '/img/partycover-sm.png'

export default class EventDecorator {
  public getEventPlaylist = (event: IEvent, user: IUser) => {
    const playlistQuery: IPlaylistQuery | undefined = parsePlaylistUrl(
      event.playlistUrl
    )
    const spotifyClient = new SpotifyClient()

    if (playlistQuery) {
      return spotifyClient.getPlaylist(
        playlistQuery.userName,
        playlistQuery.playlistId,
        user
      )
    } else {
      return Promise.reject(new Error('Invalid Playlist Url'))
    }
  }

  public decorateEvent = (event: IEvent, user: IUser) => {
    return new Promise(resolve => {
      this.getEventPlaylist(event, user)
        .then(({ body }: any) => {
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

          resolve(decoratedEvent)
        })
        .catch(() => {
          resolve({
            ...event,
            imageUrl: event.imageUrl ? event.imageUrl : defaultEventImage
          })
        })
    })
  }

  public decorateEvents = (events: IEvent[], user: IUser) => {
    return Promise.all(events.map(event => this.decorateEvent(event, user)))
  }

  public decorateSingleEvent = (event: IEvent, user: IUser) => {
    return this.decorateEvent(event, user)
  }
}
