import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'
import { IUser } from './model'
import ProfileToUser from './user/ProfileToUser'
import UserGateway from './user/UserGateway'

const SpotifyStrategy = require('passport-spotify').Strategy
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19'

const JWTStrategy = passportJWT.Strategy
const profileToUser = new ProfileToUser()
const userGateway: UserGateway = new UserGateway()

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: req => req.cookies.jwt,
      secretOrKey: 'super-super-secret-mm'
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload)
    }
  )
)

passport.use(
  'spotify-guest',
  new SpotifyStrategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL: 'https://api.musicmonkey.io/api/v1/auth/guest/callback'
    },
    handleSpotifyLogin
  )
)

passport.use(
  'spotify-guest-local',
  new SpotifyStrategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL: 'http://localhost:8080/api/v1/auth/guest/callback/local'
    },
    handleSpotifyLogin
  )
)

function handleSpotifyLogin(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  profile: any,
  done: any
) {
  const user: IUser = profileToUser.spotifyProfileToUser(
    accessToken,
    refreshToken,
    expiresIn,
    profile
  )
  userGateway
    .getOrCreateUser(user, 'spotify')
    .then(validUser => {
      done(null, validUser)
    })
    .catch(err => {
      return done(err, user)
    })
}

export default passport
