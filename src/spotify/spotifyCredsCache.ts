import * as cache from '../cache'

const cacheKey = 'cred-cache-key'

export const saveCreds = (token: string) => {
  try {
    cache.set(cacheKey, token, 3500)
  } catch (err) {
    console.error(err)
  }
}

export const getCreds = async () => {
  let creds
  try {
    creds = await cache.get(cacheKey)
  } catch (err) {
    console.error(err)
  }
  return creds
}
