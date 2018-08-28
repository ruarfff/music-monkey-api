import { isEmpty } from 'lodash'
import IFacebookPassportProfile from '../facebook/IFacebookPassportProfile'
import { ISpotifyPassportProfile } from '../spotify/ISpotifyPassportProfile'
import IUser from '../user/IUser'

/**
 * This class is to support converting different types of profiles (Spotify, Facebook etc.) to our internal User model.
 */
export default class ProfileToUser {
  public facebookProfileToUser(
    accessToken: string,
    refreshToken: string,
    profile: any
  ): IUser {
    const facebookProfile: IFacebookPassportProfile = profile._json
    return {
      facebookId: facebookProfile.id,
      facebookAuth: { accessToken, refreshToken },
      displayName: profile.displayName,
      email: facebookProfile.email,
      image: !isEmpty(profile.photos) ? profile.photos[0].value : null
    } as IUser
  }

  public spotifyProfileToUser(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    spotifyProfile: ISpotifyPassportProfile
  ): IUser {
    return {
      spotifyAuth: {
        accessToken,
        expiresAt: Date.now() + expiresIn * 1000,
        refreshToken
      },
      birthdate: spotifyProfile._json.birthdate,
      country: spotifyProfile.country,
      displayName: spotifyProfile.displayName,
      email: spotifyProfile._json.email,
      image: !isEmpty(spotifyProfile.photos) ? spotifyProfile.photos[0] : '',
      spotifyId: spotifyProfile.id
    } as IUser
  }
}
