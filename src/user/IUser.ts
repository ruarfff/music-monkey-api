import IFacebookAuth from '../auth/IFacebookAuth'
import ISpotifyAuth from '../auth/ISpotifyAuth'
import IUserAuth from '../auth/IUserAuth'

export default interface IUser {
  auth: IUserAuth
  birthdate: string
  country: string
  displayName: string
  email: string
  facebookAuth: IFacebookAuth
  facebookId: string
  image: string
  passwordHash: string
  spotifyAuth: ISpotifyAuth
  spotifyId: string
  userId: string
  isGuest: boolean
  isVerified: boolean
}
