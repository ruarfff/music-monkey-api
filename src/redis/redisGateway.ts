const REDIS_ADDRESS = process.env.REDIS_ADDRESS
import * as Redis from 'ioredis'
import { logError, logInfo } from '../logging'

let redis = {} as any

export const connect = () => {
  try {
    logInfo('Connecting to Redis')
    if (REDIS_ADDRESS) {
      redis = new Redis(REDIS_ADDRESS)
    } else {
      redis = new Redis()
    }

    redis.on('connect', () => {
      logInfo('Redis connected')
    })
    redis.on('error', (error: any) => {
      logError('Redis error', error)
    })
    redis.on('close', () => {
      logInfo('Redis connection closed')
    })
    redis.on('reconnecting', () => {
      logInfo('Redis reconnecting')
    })
  } catch (error) {
    logError('Something went wrong connecting to Redis', error)
  }
}

export const getObject = async (key: string) => {
  let result
  try {
    const rawResult = await get(key)
    result = JSON.parse(rawResult)
  } catch (err) {
    logError('Error getting an object for redis with key ' + key, err)
  }
  return result
}

export const get = async (key: string) => {
  let result
  try {
    result = await redis.get(key)
  } catch (err) {
    logError('Error getting item from redis with key ' + key, err)
  }
  return result
}

export const setObject = (key: string, value: any, expiresIn: number = 0) => {
  const serializedObject = JSON.stringify(value)
  set(key, serializedObject, expiresIn)
}

export const set = (key: string, value: any, expiresIn: number = 0) => {
  if (expiresIn > 0) {
    // Expires In is in seconds
    redis.set(key, value, 'EX', expiresIn)
  } else {
    redis.set(key, value)
  }
}

export const enableMonitoring = () => {
  logInfo('Enabling monitoring')
  const redisMonitorConnection = new Redis(REDIS_ADDRESS)
  redisMonitorConnection.monitor((err, monitor) => {
    if (err) {
      logError('An error occurred enabling monitoring', err)
    }
    monitor.on('monitor', (time, args, source, database) => {
      logInfo(`${time} - DB: ${database}: SRC - ${source} - ARGS: ${args}`)
    })
  })
}
