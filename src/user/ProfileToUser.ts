import { isEmpty } from 'lodash'
import { IUser } from '../model'
import { ISpotifyPassportProfile } from '../spotify/SpotifyPassportProfile'

/**
 * This class is to support converting different types of profiles (Spotify, Facebook etc.) to our internal User model.
 */
export default class ProfileToUser {
  public spotifyProfileToUser(
    accessToken: string,
    refreshToken: string,
    expiresIn: any,
    spotifyProfile: ISpotifyPassportProfile
  ): IUser {
    return {
      spotifyAuth: {
        accessToken,
        expiresIn,
        refreshToken
      },
      birthdate: spotifyProfile._json.birthdate,
      country: spotifyProfile.country,
      displayName: spotifyProfile.displayName,
      email: spotifyProfile._json.email,
      image: !isEmpty(spotifyProfile.photos)
        ? spotifyProfile.photos[0]
        : undefined,
      spotifyId: spotifyProfile.id
    } as IUser
  }
}
