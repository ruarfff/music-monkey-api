import { getEventById } from '../event/eventGateway'
import IEvent from '../event/model/IEvent'
import { logError } from '../logging'
import {
  getPlaylistById,
  replacePlaylistTracks
} from '../playlist/playlistService'
import IPlaylist from '../spotify/IPlaylist'
import IPlaylistItem from '../spotify/IPlaylistItem'
import IPlaylistQuery from '../spotify/IPlaylistQuery'
import parsePlaylistUrl from '../spotify/parsePlaylistUrl'
import IUser from '../user/model/IUser'
import { getUserById } from '../user/userService'
import ITrackVoteStatus from './ITrackVoteStatus'
import { getVotesWithStatus } from './voteService'

const dynamicVotingEnabled = async (event: IEvent) => {
  try {
    return event.settings && event.settings.dynamicVotingEnabled
  } catch (err) {
    logError('Error checking if dynamic voting is enables', err)
    return false
  }
}

export const handleCreateForDynamicVoting = async (eventId: string) => {
  const event = await getEventById(eventId)
  const dvEnabled = await dynamicVotingEnabled(event)
  if (dvEnabled) {
    return updateEventPlaylistBasedOnVotes(event)
  }
  return null
}

export const handleDeleteForDynamicVoting = async (eventId: string) => {
  const event = await getEventById(eventId)
  const dvEnabled = await dynamicVotingEnabled(event)
  if (dvEnabled) {
    return updateEventPlaylistBasedOnVotes(event)
  }
  return null
}

async function updateEventPlaylistBasedOnVotes(event: IEvent) {
  const user = await getUserById(event.userId)
  const votes: Map<string, ITrackVoteStatus> = await getVotesWithStatus(
    event.eventId,
    user.userId
  )
  const playlistQuery: IPlaylistQuery = parsePlaylistUrl(event.playlistUrl)
  const playlist = await getPlaylistById(user, playlistQuery.playlistId)

  return sortAndUpdatePlaylist(user, playlist, votes)
}

async function sortAndUpdatePlaylist(
  eventOwner: IUser,
  playlist: IPlaylist,
  votes: Map<string, ITrackVoteStatus>
) {
  const sortedPlaylist: IPlaylist = sortPlaylistByVotesDescending(
    playlist,
    votes
  )
  const trackIUris = sortedPlaylist.tracks.items.map(
    (p: IPlaylistItem) => p.track.uri
  )
  let result
  try {
    result = await replacePlaylistTracks(eventOwner, playlist.id, trackIUris)
  } catch (err) {
    logError('Failed to update playlist order on vote', err)
  }
  return result
}

function sortPlaylistByVotesDescending(playlist: IPlaylist, votes: any) {
  const playlistItems = [...playlist.tracks.items]
  const defaultVotes = { numberOfVotes: 0 }

  playlistItems.sort((a: any, b: any) => {
    const aVotes = (votes[a.track.uri] || defaultVotes).numberOfVotes
    const bVotes = (votes[b.track.uri] || defaultVotes).numberOfVotes

    if (aVotes === bVotes) {
      return 0
    }

    return aVotes < bVotes ? 1 : -1
  })

  return {
    ...playlist,
    tracks: { ...playlist.tracks, items: playlistItems }
  }
}
