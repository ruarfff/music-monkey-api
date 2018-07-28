import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import UserGateway from './user/userGateway'

const SpotifyStrategy = require('passport-spotify').Strategy
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19'

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const userGateway = new UserGateway()

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email: string, password: string, cb: any) => {
      return userGateway
        .getUserByEmail(email)
        .then(user => {
          console.log(password)
          if (!user) {
            return cb(null, false, { message: 'Incorrect email or password.' })
          }
          return cb(null, user, { message: 'Logged In Successfully' })
        })
        .catch(err => cb(err))
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: '264fx3zwp37n28yp8qnuj9ahz8pe4dwcewqzgpnc'
    },
    (jwtPayload, cb) => {
      return userGateway
        .getUserById(jwtPayload.id)
        .then(user => {
          return cb(null, user)
        })
        .catch(err => {
          return cb(err)
        })
    }
  )
)

passport.use(
  'spotify-host',
  new SpotifyStrategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL: 'http://localhost:8080/auth/host/callback'
    },
    (
      _accessToken: string,
      _refreshToken: string,
      _expiresIn: any,
      profile: any,
      done: any
    ) => {
      return userGateway
        .getUserByEmail(profile.email)
        .then(user => {
          return done(null, user)
        })
        .catch(err => {
          return done(err)
        })
    }
  )
)

passport.use(
  'spotify-guest',
  new SpotifyStrategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL: 'http://localhost:8080/auth/guest/callback'
    },
    (
      _accessToken: string,
      _refreshToken: string,
      _expiresIn: any,
      profile: any,
      done: any
    ) => {
      process.nextTick(() => {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        return done(null, profile)
      })

      /**
       * return userGateway
        .getUserByEmail(profile.emails[0].value)
        .then(user => {
          console.log('Got user')
          return done(null, user)
        })
        .catch(err => {
          console.error(err)
          return done(err)
        })
        */
    }
  )
)

export default passport
