import bcrypt from 'bcryptjs'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import { jwtCookieKey } from './auth/authConstants'
import {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET
} from './config'
import IUser from './user/model/IUser'
import ProfileToUser from './user/ProfileToUser'
import {
  getOrCreateUser,
  getUserByEmail,
  getUserById
} from './user/userService'

const profileToUser = new ProfileToUser()
const LocalStrategy = require('passport-local')
const SpotifyStrategy = require('passport-spotify').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const JWTStrategy = passportJWT.Strategy
const spotifyConfig = {
  clientID: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET
}
const facebookConfig = {
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  profileFields: ['id', 'displayName', 'photos', 'email']
}

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: (req) => req.cookies.jwt,
      secretOrKey: jwtCookieKey
    },
    async (jwtPayload, done) => {
      try {
        const user = await getUserById(jwtPayload.id)
        return done(null, user)
      } catch (err) {
        return done(err, jwtPayload)
      }
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
        getUserByEmail(email)
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
      ...spotifyConfig,
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
      ...spotifyConfig,
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
      ...spotifyConfig,
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
      ...spotifyConfig,
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
      ...spotifyConfig,
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
      ...spotifyConfig,
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
      ...facebookConfig,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/guest/facebook/callback'
    },
    handleFacebookLogin
  )
)

passport.use(
  'facebook-guest-local',
  new FacebookStrategy(
    {
      ...facebookConfig,
      callbackURL:
        'https://api.musicmonkey.io/api/v1/auth/guest/facebook/callback/local'
    },
    handleFacebookLogin
  )
)

passport.use(
  'facebook-guest-local-dev',
  new FacebookStrategy(
    {
      ...facebookConfig,
      callbackURL:
        'http://localhost:8080/api/v1/auth/guest/facebook/callback/local/dev'
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

  getOrCreateUser(user, 'facebook')
    .then((validUser) => {
      done(null, validUser)
    })
    .catch((err) => {
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
  getOrCreateUser(user, 'spotify')
    .then((validUser) => {
      done(null, validUser)
    })
    .catch((err) => {
      return done(err, user)
    })
}

export default passport
