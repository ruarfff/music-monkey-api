process.on('uncaughtException', function(exception) {
  console.log(exception) // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
})

/**
 * Module dependencies.
 */
import * as debugFun from 'debug'
import * as http from 'http'
import app from './app'
import graphql from './graphql'
import { logError } from './logging'
import { createTables } from './model'
import * as redisGateway from './redis/redisGateway'

const debug = debugFun('music-monkey-api:server')

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '8080')
app.set('port', port)
graphql(app)

const server = http.createServer(app)
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  const portNumber = parseInt(val, 10)

  if (isNaN(portNumber)) {
    // named pipe
    return val
  }

  if (portNumber >= 0) {
    // port number
    return portNumber
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  logError(error)
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logError(bind + ' requires elevated privileges', error)
      process.exit(1)
      break
    case 'EADDRINUSE':
      logError(bind + ' is already in use', error)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
  createTables()
  redisGateway.connect()
  if (process.env.NODE_ENV === 'development') {
    redisGateway.enableMonitoring()
  }
}
