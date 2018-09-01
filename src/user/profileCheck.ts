import { logError, logInfo } from '../logging'
import { getUserProfile } from '../spotify/SpotifyClient'
import UserService from '../user/UserService'
import IUser from './IUser'

const userService: UserService = new UserService()

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
        return await userService.updateUser(user)
      }
    }
  } catch (err) {
    logError('Error checking user profile', err)
  }
  return user
}
