import IVote from './IVote'
import { getVotesByEventId, getVotesByUserId } from './voteGateway'
import { getMultipleTracks } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'
import ITrack from '../spotify/ITrack'

export const getVotesWithStatus = async (eventId: string, userId: string) => {
  const votes: IVote[] = await getVotesByEventId(eventId)
  const votesWithStatus = {} as any
  votes.forEach((vote: IVote) => {
    let votedByCurrentUser = vote.userId === userId
    let numberOfVotes = 1
    const voteStatus = votesWithStatus[vote.trackId]
    if (voteStatus) {
      numberOfVotes += voteStatus.numberOfVotes
      votedByCurrentUser = voteStatus.votedByCurrentUser || votedByCurrentUser
    }
    votesWithStatus[vote.trackId] = { numberOfVotes, votedByCurrentUser }
  })
  return votesWithStatus
}

export const getVotesByUserWithTracks = async (user: IUser) => {
  const votes = await getVotesByUserId(user.userId)
  let allTracks: ITrack[] = []
  let trackIds = votes.map(v => v.trackId.split(':')[2])
  trackIds = trackIds.filter((item, i) => trackIds.indexOf(item) === i)
  if (trackIds.length <= 50) {
    const { tracks } = await getMultipleTracks(trackIds, user)
    allTracks = tracks
  } else {
    const chunk = 50
    let i
    let j
    let chunkedTrackIds
    for (i = 0, j = trackIds.length; i < j; i += chunk) {
      chunkedTrackIds = trackIds.slice(i, i + chunk)
      const { tracks } = await getMultipleTracks(chunkedTrackIds, user)
      allTracks = [...allTracks, ...tracks]
    }
  }
  const trackMap = new Map<string, ITrack>()
  allTracks.forEach(t => {
    trackMap.set(t.id, t)
  })
  return votes.map(v => ({
    ...v,
    track: trackMap.get(v.trackId.split(':')[2])
  }))
}
