import IFacebookAuth from '../auth/IFacebookAuth'
import ISpotifyAuth from '../auth/ISpotifyAuth'

export default interface IUser {
  birthdate: string
  country: string
  displayName: string
  email: string
  facebookAuth: IFacebookAuth
  phone: string
  facebookId: string
  instagramId: string
  twitterId: string
  image: string
  passwordHash: string
  spotifyAuth: ISpotifyAuth
  spotifyId: string
  userId: string
  isGuest: boolean
  isVerified: boolean
}
