import { isEmpty, uniq } from 'lodash'
import { logError } from '../logging'
import IPlaylist from '../spotify/IPlaylist'
import ITrack from '../spotify/ITrack'
import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylist,
  removeTrackFromPlaylist,
  removeTracksFromPlaylist,
  removeTracksFromPlaylistByPosition,
  reorderTracksInPlaylist,
  replaceTracksInPlaylist
} from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
import { findDuplicatedTracks } from './duplicateFinder'
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
  await addTracksToPlaylist(user, playlistId, trackUris)
  const playlist: IPlaylist = await getPlaylistById(user, playlistId)
  try {
    const duplicates = findDuplicatedTracks(
      playlist.tracks.items.map(item => item.track)
    )
    if (!isEmpty(duplicates)) {
      await removeDuplicates(user, playlist, duplicates)
    }
  } catch (err) {
    logError('Error deduping playlist', err)
  }
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
  const playlist = await replaceTracksInPlaylist(
    user,
    playlistId,
    uniq(trackUris)
  )
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

export const deleteTracksFromPlaylist = async (
  user: IUser,
  playlistId: string,
  tracks: ITrack[]
) => {
  const playlist = await removeTracksFromPlaylist(user, playlistId, tracks)
  onPlaylistUpdated(playlistId)
  return playlist
}

export const deleteTracksAtPositionsFromPlaylist = async (
  user: IUser,
  playlistId: string,
  snapshotId: string,
  positions: number[]
) => {
  const playlist = await removeTracksFromPlaylistByPosition(
    user,
    playlistId,
    snapshotId,
    positions
  )
  onPlaylistUpdated(playlistId)
  return playlist
}

async function removeDuplicates(
  user: IUser,
  playlist: IPlaylist,
  duplicates: ITrack[]
) {
  if (playlist.id === 'starred') {
    throw new Error(
      `It is not possible to delete duplicates from your Starred playlist using this tool
        since this is not supported in the Spotify Web API.
        You will need to remove these manually.`
    )
  }
  if (playlist.collaborative) {
    throw new Error(
      `It is not possible to delete duplicates from a collaborative playlist using this tool
        since this is not supported in the Spotify Web API.
        You will need to remove these manually.`
    )
  }
  const tracksToRemove = duplicates.map((d: any) => d.index)

  return await deleteTracksAtPositionsFromPlaylist(
    user,
    playlist.id,
    playlist.snapshot_id,
    tracksToRemove
  )
}
