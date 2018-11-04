import { getAudioFeaturesForTracks } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'

export const getAudioFeaturesByTrackIds = async (
  user: IUser,
  trackIds: string[]
) => {
  return await getAudioFeaturesForTracks(user, trackIds)
}
