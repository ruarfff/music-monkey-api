// Trimmed down version of the user data that doesn't expose anything too bad
export default interface ISafeUser {
  country: string
  displayName: string
  image: string
  userId: string
  isGuest: boolean
}
