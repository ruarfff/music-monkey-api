import swaggerJSDoc = require('swagger-jsdoc')
import { IS_PRODUCTION } from './config'
// swagger definition
const swaggerDefinition = {
  info: {
    title: 'MusicMonkey API',
    version: '1.0.0',
    description: 'API server for MusicMonkey application.'
  },
  host: IS_PRODUCTION ? 'api.musicmonkey.io' : 'localhost:8080',
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
export const swaggerSpec = swaggerJSDoc(options)
