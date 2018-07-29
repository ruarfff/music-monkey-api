import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'

const SpotifyStrategy = require('passport-spotify').Strategy
const clientId = 'ee4aa78cde4c4be08978d79c180e11c9'
const clientSecret = 'acfc43102e5c4e05902e66284dfdcb19'

const JWTStrategy = passportJWT.Strategy

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: req => {
        console.log('req.cookies.jwt', req.cookies.jwt)
        return req.cookies.jwt
      },
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
      callbackURL: 'http://localhost:8080/auth/guest/callback'
    },
    (
      _accessToken: string,
      _refreshToken: string,
      _expiresIn: any,
      profile: any,
      done: any
    ) => {
      console.log('HHHHEHEHEHE')
      process.nextTick(() => {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        return done(null, profile)
      })
    }
  )
)

export default passport
