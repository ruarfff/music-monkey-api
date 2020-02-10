import IPlaylistParams from '../playlist/IPlaylistParams'
import IUser from '../user/model/IUser'
import ITrack from './ITrack'
import * as api from './spotifyApiGateway'
import {
  cacheNewReleases,
  cachePlaylist,
  cacheRecommendations,
  cacheSearch,
  cacheUsersPlaylists,
  cacheUserTopTracks,
  clearCachedPlaylist,
  getCachedNewReleases,
  getCachedPlaylist,
  getCachedRecommendations,
  getCachedSearch,
  getCachedUsersPlaylists,
  getCachedUserTopTracks
} from './spotifyClientCache'

export const getUserProfile = async (user: IUser) => {
  return await api.getUserProfile(user)
}

export const getNewReleases = async (country: string, user: IUser) => {
  let newReleases = await getCachedNewReleases(country)
  if (newReleases) {
    return newReleases
  }

  newReleases = await api.getNewReleases(user, {
    limit: 10,
    offset: 0,
    country
  })
  cacheNewReleases(country, newReleases)
  return newReleases
}

export const getRecommendations = async (user: IUser) => {
  let recommendations = await getCachedRecommendations(user.userId)
  if (recommendations) {
    return recommendations
  }
  const seeds = ['alt_rock', 'blues', 'dance', 'hard_rock', 'hip_hop']
  recommendations = await api.getRecommendations(user, {
    min_energy: 0.5,
    min_popularity: 50,
    seed_genres: seeds
  })

  cacheRecommendations(user.userId, recommendations)
  return recommendations
}

export const searchTracks = async (searchTerm: string, user: IUser) => {
  let tracks = await getCachedSearch(searchTerm)
  if (tracks) {
    return tracks
  }
  tracks = await api.searchTracks(user, searchTerm)
  cacheSearch(searchTerm, tracks)
  return tracks
}

export const getUserTopTracks = async (user: IUser) => {
  let topTracks = await getCachedUserTopTracks(user.userId)

  if (topTracks) {
    return topTracks
  }

  topTracks = await api.getUserTopTracks(user)
  cacheUserTopTracks(user.userId, topTracks)

  return topTracks
}

export const getMultipleTracks = async (
  trackIds: string[],
  user: IUser
): Promise<{ tracks: ITrack[] }> => {
  return await api.getMultipleTracks(user, trackIds)
}

export const getAudioFeaturesForTracks = async (
  user: IUser,
  trackIds: string[]
) => {
  return await api.getAudioFeaturesForTracks(user, trackIds)
}

export const createPlaylist = async (
  user: IUser,
  playlistParams: IPlaylistParams
) => {
  return await api.createPlaylist(user, playlistParams)
}

export const getPlaylist = async (user: IUser, playlistId: string) => {
  let playlist = await getCachedPlaylist(playlistId)
  if (playlist) {
    return playlist
  }

  playlist = await api.getPlaylist(user, playlistId)
  cachePlaylist(playlistId, playlist)

  return playlist
}

export const getUserPlaylists = async (user: IUser, options: any) => {
  let playlists = await getCachedUsersPlaylists(user.userId)
  if (playlists) {
    return playlists
  }
  playlists = await api.getUserPlaylists(user, options)
  cacheUsersPlaylists(user.userId, playlists)
  return playlists
}

export const reorderTracksInPlaylist = async (
  user: IUser,
  playlistId: string,
  fromIndex: number,
  toIndex: number
) => {
  clearCachedPlaylist(playlistId)
  await api.reorderTracksInPlaylist(user, playlistId, fromIndex, toIndex)
  return await getPlaylist(user, playlistId)
}

export const editPlaylistDetails = async (
  user: IUser,
  playlistId: string,
  name: string,
  description: string
) => {
  clearCachedPlaylist(playlistId)
  await api.editPlaylistDetails(user, playlistId, name, description)
  return await getPlaylist(user, playlistId)
}

export const replaceTracksInPlaylist = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
  clearCachedPlaylist(playlistId)
  await api.replaceTracksInPlaylist(user, playlistId, trackUris)
  return await getPlaylist(user, playlistId)
}

export const addTracksToPlaylist = async (
  user: IUser,
  playlistId: string,
  trackUris: string[]
) => {
  clearCachedPlaylist(playlistId)
  await api.addTracksToPlaylist(user, playlistId, trackUris)
  return await getPlaylist(user, playlistId)
}

export const removeTracksFromPlaylistByPosition = async (
  user: IUser,
  playlistId: string,
  snapshotId: string,
  positions: number[]
) => {
  clearCachedPlaylist(playlistId)
  await api.removeTracksFromPlaylistByPosition(
    user,
    playlistId,
    snapshotId,
    positions
  )
  return await getPlaylist(user, playlistId)
}

export const removeTracksFromPlaylist = async (
  user: IUser,
  playlistId: string,
  tracks: ITrack[]
) => {
  clearCachedPlaylist(playlistId)
  await api.removeTracksFromPlaylist(user, playlistId, tracks)
  return await getPlaylist(user, playlistId)
}

export const removeTrackFromPlaylist = async (
  user: IUser,
  playlistId: string,
  track: ITrack
) => {
  return await removeTracksFromPlaylist(user, playlistId, [track])
}
