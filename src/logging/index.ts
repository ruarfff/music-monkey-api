const winston = require('winston')
require('winston-loggly-bulk')

winston.add(winston.transports.Loggly, {
  token: '9bcc7303-1a8d-4a2e-acec-aa840a51fe78',
  subdomain: 'ruairiobrien',
  tags: ['music-monkey-api'],
  json: true
})

export const logInfo = (message: string) => {
  winston.log('info', message)
}

export const logDebug = (message: string) => {
  winston.log('debug', message)
}

export const logError = (message: string, err: any = {}) => {
  winston.log('error', message, err)
}
