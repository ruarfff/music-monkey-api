import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as session from 'express-session'
import * as helmet from 'helmet'
import * as logger from 'morgan'
import { createTables } from './model'
import passport from './passport'

import indexRouter from './routes'
import authRouter from './routes/auth'
import eventRouter from './routes/events'
import inviteRouter from './routes/invites'
import legacyAuthRouter from './routes/legacyAuth'
import suggestionsRouter from './routes/suggestions'
import userRouter from './routes/users'

createTables()
const app = express()

const sess = {
  secret: 'music-monkey-super-secret',
  saveUninitialized: true,
  cookie: {} as any,
  resave: true
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

app.use(logger('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/', legacyAuthRouter)
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/suggestions', suggestionsRouter)
app.use('/invites', inviteRouter)
app.use('/events', eventRouter)

// error handler
app.use((err: any, req: any, res: any, _next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
})

export default app