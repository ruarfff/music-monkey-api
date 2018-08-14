import * as cache from '../cache'
import { logError } from '../logging'

const cacheKey = 'cred-cache-key'

export const saveCreds = (token: string) => {
  try {
    cache.set(cacheKey, token, 3500)
  } catch (err) {
    logError('Error setting cached credentials', err)
  }
}

export const getCreds = async () => {
  let creds
  try {
    creds = await cache.get(cacheKey)
  } catch (err) {
    logError('Error getting cached creds', err)
  }
  return creds
}
