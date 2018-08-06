import * as NodeCache from 'node-cache'

const credCache = new NodeCache({ stdTTL: 3300, checkperiod: 300 })
const cacheKey = 'cred-cache-key'

export const saveCreds = (token: string) => {
  credCache.set(cacheKey, token, (cacheErr: any) => {
    if (cacheErr) {
      console.error('Failed to cache credentials', cacheErr)
    }
  })
}

export const getCreds = () => {
  return new Promise((resolve, reject) => {
    credCache.get(cacheKey, (err: any, value: any) => {
      if (value === undefined || err) {
        reject()
      } else {
        resolve(value)
      }
    })
  })
}
