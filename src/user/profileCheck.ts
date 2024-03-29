import { logDebug, logInfo } from '../logging'
import { getUserProfile } from '../spotify/spotifyClient'
import IUser from './model/IUser'
import { updateUser } from './userService'

export const checkUserProfile = async (user: IUser) => {
  try {
    if (user.spotifyId) {
      const profile = await getUserProfile(user)
      const { url } =
        profile.images && profile.images.length > 0
          ? profile.images[0]
          : { url: null }
      if (url && url !== user.image) {
        user.image = url
        logInfo('User image updated to user ' + user.userId)
        return await updateUser(user)
      }
    }
  } catch (err) {
    logDebug('Error checking user profile: ' + err)
  }
  return user
}
