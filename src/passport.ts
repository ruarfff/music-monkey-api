import * as bcrypt from 'bcrypt'
import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'
import { jwtCookieKey } from './auth/authConstants'
import IUser from './user/IUser'
import ProfileToUser from './user/ProfileToUser'
import UserGateway from './user/UserGateway'
import UserService from './user/UserService'

const LocalStrategy = require('passport-local')
const SpotifyStrategy = require('passport-spotify').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const spotifyClientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const spotifyClientSecret = 'acfc43102e5c4e05902e66284dfdcb19'
const facebookAppId = '226286181115039'
const facebookAppSecret = 'ab450950666b33b434684bc8a2c24ca5'

const JWTStrategy = passportJWT.Strategy
const profileToUser = new ProfileToUser()
const userGateway: UserGateway = new UserGateway()
const userService: UserService = new UserService()

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
      secretOrKey: jwtCookieKey
    },
    (jwtPayload, done) => {
      return userService
        .getUserById(jwtPayload.id)
        .then((user: IUser) => {
          return done(null, user)
        })
        .catch((err: Error) => {
          return done(err, jwtPayload)
        })
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email: string, password: string, done: any) => {
      try {
        userService
          .getUserByEmail(email)
          .then(async (user: IUser) => {
            const passwordsMatch = await bcrypt.compare(
              password,
              user.passwordHash
            )
            if (passwordsMatch) {
              return done(null, user)
            } else {
              return done('Incorrect Username / Password')
            }
          })
          .catch((err: any) => {
            done(err)
          })
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  'spotify-host',
  new SpotifyStrategy(
    {
      clientID: spotifyClientId,
      clientSecret: spotifyClientSecret,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/host/spotify/callback'
    },
    handleSpotifyLogin
  )
)

passport.use(
  'spotify-host-local',
  new SpotifyStrategy(
    {
      clientID: spotifyClientId,
      clientSecret: spotifyClientSecret,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/host/spotify/callback/local'
    },
    handleSpotifyLogin
  )
)

passport.use(
  'spotify-host-local-dev',
  new SpotifyStrategy(
    {
      clientID: spotifyClientId,
      clientSecret: spotifyClientSecret,
      callbackURL:
        'http://localhost:8080/api/v1/auth/host/spotify/callback/local/dev'
    },
    handleSpotifyLogin
  )
)

passport.use(
  'spotify-guest',
  new SpotifyStrategy(
    {
      clientID: spotifyClientId,
      clientSecret: spotifyClientSecret,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/guest/spotify/callback'
    },
    handleSpotifyLogin
  )
)

passport.use(
  'spotify-guest-local',
  new SpotifyStrategy(
    {
      clientID: spotifyClientId,
      clientSecret: spotifyClientSecret,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/guest/spotify/callback/local'
    },
    handleSpotifyLogin
  )
)

passport.use(
  'spotify-guest-local-dev',
  new SpotifyStrategy(
    {
      clientID: spotifyClientId,
      clientSecret: spotifyClientSecret,
      callbackURL:
        'http://localhost:8080/api/v1/auth/guest/spotify/callback/local/dev'
    },
    handleSpotifyLogin
  )
)

passport.use(
  'facebook-guest',
  new FacebookStrategy(
    {
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/guest/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    handleFacebookLogin
  )
)

passport.use(
  'facebook-guest-local',
  new FacebookStrategy(
    {
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/guest/facebook/callback/local',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    handleFacebookLogin
  )
)

passport.use(
  'facebook-guest-local-dev',
  new FacebookStrategy(
    {
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      callbackURL:
        'http://localhost:8080/api/v1/auth/guest/facebook/callback/local/dev',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    handleFacebookLogin
  )
)

function handleFacebookLogin(
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: any
) {
  const user: IUser = profileToUser.facebookProfileToUser(
    accessToken,
    refreshToken,
    profile
  )
  userGateway
    .getOrCreateUser(user, 'facebook')
    .then(validUser => {
      done(null, validUser)
    })
    .catch(err => {
      return done(err, user)
    })
}
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
