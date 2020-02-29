const expressWinston = require('express-winston')
import { Request } from 'express'
import Rollbar from 'rollbar'
import winston from 'winston'
import { IS_PRODUCTION, ROLLBAR_ACCESS_TOKEN } from '../config'
let rollbar = {} as any
const logger = winston.createLogger()

if (IS_PRODUCTION) {
  rollbar = new Rollbar({
    accessToken: ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
  })
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

export const expressLogger = expressWinston.logger({
  winstonInstance: logger,
  ignoredRoutes: ['/ping'],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
})

export const rollbarErrorHandler = IS_PRODUCTION
  ? rollbar.errorHandler()
  : () => ({})

export const logInfo = (message: string) => {
  logger.log('info', message)
}

export const logDebug = (message: string) => {
  logger.log('debug', message)
}

export const logError = (
  message: string,
  err: Error = new Error(),
  request: Request = null
) => {
  let fullMessage = message
  logger.log('error', message, err)
  if (err.message) {
    fullMessage += ' : ' + err.message
  }
  err.message = fullMessage
  if (IS_PRODUCTION) {
    if (request) {
      rollbar.error(err, request)
    } else {
      rollbar.error(err)
    }
  }
}
