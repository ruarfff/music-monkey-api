import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as helmet from 'helmet'
import { expressLogger, rollbarErrorHandler } from './logging'
import passport from './passport'

import authRouter from './auth/authRoutes'
import guestAuthRouter from './auth/guestAuthRoutes'
import hostAuthRouter from './auth/hostAuthRoutes'
import eventsRouter from './event/eventRoutes'
import inviteEventRouter from './event/inviteEventRoute'
import indexRouter from './indexRoutes'
import userPlaylistRouter from './playlist/userPlaylistRoutes'
import recommendationsRouter from './recommendation/recommendationRoutes'
import rsvpRouter from './rsvp/rsvpRoutes'
import userRsvpRouter from './rsvp/userRsvpRoutes'
import searchRouter from './search/searchRoutes'
import suggestionsRouter from './suggestion/suggestionRoutes'
import userSuggestionsRouter from './suggestion/userSuggestionRoutes'
import eventVoteRouter from './vote/eventVoteRoutes'
import voteRouter from './vote/voteRoutes'

const app = express()
let isProduction = false

if (app.get('env') === 'production') {
  console.log('Is Production')
  isProduction = true
}

if (isProduction) {
  app.set('trust proxy', 1) // trust first proxy
}

const whitelist = [
  'http://localhost:3001',
  'http://localhost:3002',
  'https://hosts.musicmonkey.io',
  'https://guests.musicmonkey.io'
]
const corsOptions = {
  credentials: true,
  origin: (origin: any, callback: any) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(expressLogger)
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())

app.use('/', indexRouter)

const apiV1 = '/api/v1'
app.use(apiV1 + '/suggestions', suggestionsRouter)
app.use(apiV1 + '/auth', authRouter)
app.use(apiV1 + '/auth', guestAuthRouter)
app.use(apiV1 + '/auth', hostAuthRouter)
app.use(apiV1 + '/users', userPlaylistRouter)
app.use(apiV1 + '/users', userRsvpRouter)
app.use(apiV1 + '/users', userSuggestionsRouter)
app.use(apiV1 + '/events', eventsRouter)
app.use(apiV1 + '/events', eventVoteRouter)
app.use(apiV1 + '/invites', inviteEventRouter)
app.use(apiV1 + '/search', searchRouter)
app.use(apiV1 + '/recommendations', recommendationsRouter)
app.use(apiV1 + '/rsvp', rsvpRouter)
app.use(apiV1 + '/votes', voteRouter)

if (isProduction) {
  app.use(rollbarErrorHandler)
}
// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.send(err.message)
  next()
})

export default app
