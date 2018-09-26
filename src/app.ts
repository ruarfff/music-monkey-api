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
import userEventRouter from './event/userEventRoute'
import indexRouter from './indexRoutes'
import userPlaylistRouter from './playlist/userPlaylistRoutes'
import recommendationsRouter from './recommendation/recommendationRoutes'
import rsvpRouter from './rsvp/rsvpRoutes'
import userRsvpRouter from './rsvp/userRsvpRoutes'
import searchRouter from './search/searchRoutes'
import suggestionsRouter from './suggestion/suggestionRoutes'
import userSuggestionsRouter from './suggestion/userSuggestionRoutes'
import userRouter from './user/userRoutes'
import eventVoteRouter from './vote/eventVoteRoutes'
import voteRouter from './vote/voteRoutes'

import swaggerJSDoc = require('swagger-jsdoc')

const isProduction = process.env.NODE_ENV === 'production'
const app = express()

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'MusicMonkey API',
    version: '1.0.0',
    description: 'API server for MusicMonkey application.'
  },
  host: isProduction ? 'api.musicmonkey.io' : 'localhost:8080',
  basePath: '/api/v1/',
  securityDefinitions: {
    cookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'jwt'
    }
  },
  security: [{ cookieAuth: [] as any[] }]
}
// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./**/*Routes.js', 'indexRoutes.js'] // pass all in array
}
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options)

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
app.use(apiV1 + '/users', userRouter)
app.use(apiV1 + '/users', userPlaylistRouter)
app.use(apiV1 + '/users', userRsvpRouter)
app.use(apiV1 + '/users', userSuggestionsRouter)
app.use(apiV1 + '/users', userEventRouter)
app.use(apiV1 + '/events', eventsRouter)
app.use(apiV1 + '/events', eventVoteRouter)
app.use(apiV1 + '/invites', inviteEventRouter)
app.use(apiV1 + '/search', searchRouter)
app.use(apiV1 + '/recommendations', recommendationsRouter)
app.use(apiV1 + '/rsvp', rsvpRouter)
app.use(apiV1 + '/votes', voteRouter)

app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(express.static('public'))

if (isProduction) {
  app.use(rollbarErrorHandler)
}
// error handler
app.use((err: any, _req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = isProduction ? err : {}
  res.status(err.status || 500)
  res.send(err.message)
  next()
})

export default app
