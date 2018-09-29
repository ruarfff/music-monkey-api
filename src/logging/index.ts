const expressWinston = require('express-winston')
import { Request } from 'express'
import {
  LOGGLY_SUB_DOMAIN,
  LOGGLY_TOKEN,
  ROLLBAR_ACCESS_TOKEN
} from '../config'
const winston = require('winston')
const { Loggly } = require('winston-loggly-bulk')
const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
})
const test = process.env
console.log(test)
const logger = winston.createLogger()

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  const logglyTransport = {
    token: LOGGLY_TOKEN,
    subdomain: LOGGLY_SUB_DOMAIN,
    tags: ['music-monkey-api'],
    json: true
  }
  logger.add(new Loggly(logglyTransport))
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

export const expressLogger = expressWinston.logger({
  winstonInstance: logger,
  ignoredRoutes: ['/ping']
})

export const rollbarErrorHandler = rollbar.errorHandler()

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
  if (request) {
    rollbar.error(err, request)
  } else {
    rollbar.error(err)
  }
}
