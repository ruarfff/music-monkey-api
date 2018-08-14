import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as helmet from 'helmet'
import * as logger from 'morgan'
import passport from './passport'

import authRouter from './auth/authRoutes'
import eventsRouter from './event/eventRoutes'
import indexRouter from './indexRoutes'
import inviteRouter from './invite/inviteRoutes'
import legacyAuthRouter from './routes/legacyAuth'
import legacyEventRouter from './routes/legacyEvents'
import legacySuggestionsRouter from './routes/legacySuggestions'
import recommendationsRouter from './routes/recommendations'
import suggestionsRouter from './routes/suggestions'
import userPlaylistRouter from './routes/userPlaylists'
import userRouter from './routes/users'
import searchRouter from './search/searchRoutes'

const app = express()

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

const whitelist = [
  'http://localhost:3000',
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

app.use(logger('dev'))
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())

app.use('/', indexRouter)
app.use('/', legacyAuthRouter)
app.use('/users', userRouter)
app.use('/suggestions', legacySuggestionsRouter)
app.use('/invites', inviteRouter)
app.use('/events', legacyEventRouter)

const apiV1 = '/api/v1'
app.use(apiV1 + '/suggestions', suggestionsRouter)
app.use(apiV1 + '/auth', authRouter)
app.use(apiV1 + '/users', userPlaylistRouter)
app.use(apiV1 + '/events', eventsRouter)
app.use(apiV1 + '/recommendations', recommendationsRouter)
app.use(apiV1 + '/search', searchRouter)

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
