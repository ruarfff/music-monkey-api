import { getAudioFeaturesForTracks } from '../spotify/spotifyClient'
import IUser from '../user/model/IUser'

export const getAudioFeaturesByTrackIds = async (
  user: IUser,
  trackIds: string[]
) => {
  const result = await getAudioFeaturesForTracks(user, trackIds)
  return result
}
