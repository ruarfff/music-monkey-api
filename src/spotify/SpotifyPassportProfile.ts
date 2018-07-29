import IRawSpotifyProfile from './RawSpotifyProfile'

/**
 * Type representing the data we get after authenticating Spotify with passport.s
 */
export interface ISpotifyPassportProfile {
  provider: string
  id: string
  username: string
  displayName: string
  profileUrl: string
  photos: string[]
  country: string
  followers: number
  product: string
  _json: IRawSpotifyProfile
}
