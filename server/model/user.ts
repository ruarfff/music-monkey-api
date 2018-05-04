export interface IUserAuth {
  refreshToken: string
  accessToken: string
  expiresIn: number
}

export interface IUser {
  userId: string
  email: string
  displayName: string
  country: string
  birthdate: string
  image: string
  auth: IUserAuth
}
