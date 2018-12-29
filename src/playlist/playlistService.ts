import ITrack from '../spotify/ITrack'
import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylist,
  removeTrackFromPlaylist,
  reorderTracksInPlaylist,
  replaceTracksInPlaylist
} from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
import IPlaylistParams from './IPlaylistParams'
import { onPlaylistUpdated } from './playlistNotifier'

export const getPlaylistById = async (user: IUser, playlistId: string) => {
  return await getPlaylist(user, playlistId)
}

export const createNewPlaylist = async (
  user: IUser,
  playlistParams: IPlaylistParams
) => {
  return await createPlaylist(user, { ...playlistParams, public: true })
}

export const addTracksToExistingPlaylist = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
  const playlist = await addTracksToPlaylist(user, playlistId, trackUris)
  onPlaylistUpdated(playlistId)
  return playlist
}

export const reOrderPlaylist = async (
  user: IUser,
  playlistId: string,
  fromIndex: number,
  toIndex: number
) => {
  const playlist = await reorderTracksInPlaylist(
    user,
    playlistId,
    fromIndex,
    toIndex
  )
  onPlaylistUpdated(playlistId)
  return playlist
}

export const replacePlaylistTracks = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
  const playlist = await replaceTracksInPlaylist(user, playlistId, trackUris)
  onPlaylistUpdated(playlistId)
  return playlist
}

export const deleteSingleTrackFromPlaylist = async (
  user: IUser,
  playlistId: string,
  track: ITrack
) => {
  const playlist = await removeTrackFromPlaylist(user, playlistId, track)
  onPlaylistUpdated(playlistId)
  return playlist
}
