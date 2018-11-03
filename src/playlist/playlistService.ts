import { createPlaylist } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
import IPlaylistParams from './IPlaylistParams'
export const createNewPlaylist = async (
  user: IUser,
  playlistParams: IPlaylistParams
) => {
  return await createPlaylist(user, { ...playlistParams, public: true })
}
