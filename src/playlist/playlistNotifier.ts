import { send } from '../notification'

export const onPlaylistUpdated = (playlistId: string) => {
  send('mm-playlists-' + playlistId, 'playlist-updated', {})
}
