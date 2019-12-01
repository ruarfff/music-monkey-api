import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { IS_PRODUCTION } from './config'
import { expressLogger, rollbarErrorHandler } from './logging'
import passport from './passport'
import { swaggerSpec } from './swagger'

import authRouter from './auth/authRoutes'
import guestAuthRouter from './auth/guestAuthRoutes'
import hostAuthRouter from './auth/hostAuthRoutes'
import eventsRouter from './event/eventRoutes'
import inviteEventRouter from './event/inviteEventRoute'
import userEventRouter from './event/userEventRoute'
import indexRouter from './indexRoutes'
import inviteRouter from './invite/inviteRoutes'
import notificationRouter from './notification/notificationRoutes'
import playlistRouter from './playlist/playlistRoutes'
import userPlaylistRouter from './playlist/userPlaylistRoutes'
import recommendationsRouter from './recommendation/recommendationRoutes'
import rsvpRouter from './rsvp/rsvpRoutes'
import userRsvpRouter from './rsvp/userRsvpRoutes'
import searchRouter from './search/searchRoutes'
import shareRouter from './share/shareRoutes'
import suggestionsRouter from './suggestion/suggestionRoutes'
import userSuggestionsRouter from './suggestion/userSuggestionRoutes'
import trackRouter from './track/trackRoutes'
import userRouter from './user/userRoutes'
import eventVoteRouter from './vote/eventVoteRoutes'
import voteRouter from './vote/voteRoutes'

const app = express()

if (IS_PRODUCTION) {
  app.set('trust proxy', 1) // trust first proxy
}

const whitelist = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:8080',
  'https://www.musicmonkey.io',
  'https://musicmonkey.io',
  'https://hosts.musicmonkey.io',
  'https://guests.musicmonkey.io',
  'https://api.musicmonkey.io',
  'chrome-extension://coohjcphdfgbiolnekdpbcijmhambjff'
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
app.use(apiV1 + '/auth', authRouter)
app.use(apiV1 + '/auth', guestAuthRouter)
app.use(apiV1 + '/auth', hostAuthRouter)
app.use(apiV1 + '/events', eventsRouter)
app.use(apiV1 + '/events', eventVoteRouter)
app.use(apiV1 + '/invites', inviteEventRouter)
app.use(apiV1 + '/invites', inviteRouter)
app.use(apiV1 + '/notifications', notificationRouter)
app.use(apiV1 + '/playlists', playlistRouter)
app.use(apiV1 + '/rsvp', rsvpRouter)
app.use(apiV1 + '/recommendations', recommendationsRouter)
app.use(apiV1 + '/search', searchRouter)
app.use(apiV1 + '/share', shareRouter)
app.use(apiV1 + '/suggestions', suggestionsRouter)
app.use(apiV1 + '/tracks', trackRouter)
app.use(apiV1 + '/users', userPlaylistRouter)
app.use(apiV1 + '/users', userRsvpRouter)
app.use(apiV1 + '/users', userSuggestionsRouter)
app.use(apiV1 + '/users', userEventRouter)
app.use(apiV1 + '/users', userRouter)
app.use(apiV1 + '/votes', voteRouter)

app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(express.static('public'))

if (IS_PRODUCTION) {
  app.use(rollbarErrorHandler)
}
// error handler
app.use((err: any, _req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = IS_PRODUCTION ? {} : err
  res.status(err.status || 500)
  res.send(err.message)
  next()
})

export default app
