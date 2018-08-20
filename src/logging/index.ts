const expressWinston = require('express-winston')
const winston = require('winston')
const { Loggly } = require('winston-loggly-bulk')

const logger = winston.createLogger()

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  const logglyTransport = {
    token: '9bcc7303-1a8d-4a2e-acec-aa840a51fe78',
    subdomain: 'ruairiobrien',
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
  winstonInstance: logger
})

export const logInfo = (message: string) => {
  logger.log('info', message)
}

export const logDebug = (message: string) => {
  logger.log('debug', message)
}

export const logError = (message: string, err: any = {}) => {
  logger.log('error', message, err)
}
