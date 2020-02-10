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
  let trackIds = votes.map(v => v.trackId.split(':')[2])
  trackIds = trackIds.filter((item, i) => trackIds.indexOf(item) === i)
  const trackMap = new Map<string, ITrack>()
  const { tracks } = await getMultipleTracks(trackIds, user)
  tracks.forEach(t => {
    trackMap.set(t.id, t)
  })
  return votes.map(v => ({
    ...v,
    track: trackMap.get(v.trackId.split(':')[2])
  }))
}
