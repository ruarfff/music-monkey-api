const isProduction = process.env.NODE_ENV === 'production'

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET
const facebookAppId = process.env.FACEBOOK_APP_ID
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET

const dynamoDbId = process.env.DYNAMO_DB_USER_ID
const dynamoDbSecretKey = process.env.DYNAMO_DB_SECRET_KEY
const dynamoDbRegion = process.env.DYNAMO_DB_REGION

const rollbarAccessToken = process.env.ROLLBAR_ACCESS_TOKEN

const logglyToken = process.env.LOGGLY_TOKEN
const logglySubDomain = process.env.LOGGLY_SUB_DOMAIN

const pusherAppId = process.env.PUSHER_APP_ID
const pusherKey = process.env.PUSHER_KEY
const pusherSecret = process.env.PUSHER_SECRET
const pusherCluster = process.env.PUSHER_CLUSTER

export const IS_PRODUCTION = isProduction

export const SPOTIFY_CLIENT_ID = spotifyClientId
export const SPOTIFY_CLIENT_SECRET = spotifyClientSecret
export const FACEBOOK_APP_ID = facebookAppId
export const FACEBOOK_APP_SECRET = facebookAppSecret

export const DYNAMO_DB_ID = dynamoDbId
export const DYNAMO_DB_SECRET_KEY = dynamoDbSecretKey
export const DYNAMO_DB_REGION = dynamoDbRegion

export const ROLLBAR_ACCESS_TOKEN = rollbarAccessToken

export const LOGGLY_TOKEN = logglyToken
export const LOGGLY_SUB_DOMAIN = logglySubDomain

export const PUSHER_APP_ID = pusherAppId
export const PUSHER_KEY = pusherKey
export const PUSHER_SECRET = pusherSecret
export const PUSHER_CLUSTER = pusherCluster
