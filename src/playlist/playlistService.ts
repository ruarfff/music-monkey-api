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
  return await addTracksToPlaylist(user, playlistId, trackUris)
}

export const reOrderPlaylist = async (
  user: IUser,
  playlistId: string,
  fromIndex: number,
  toIndex: number
) => {
  return await reorderTracksInPlaylist(user, playlistId, fromIndex, toIndex)
}

export const replacePlaylistTracks = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
  return await replaceTracksInPlaylist(user, playlistId, trackUris)
}

export const deleteSingleTrackFromPlaylist = async (
  user: IUser,
  playlistId: string,
  track: ITrack
) => {
  return await removeTrackFromPlaylist(user, playlistId, track)
}
