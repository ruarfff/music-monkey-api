const REDIS_ADDRESS = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
import * as Redis from 'ioredis'

let redis = {} as any

export const connect = () => {
  try {
    console.log('Connecting to Redis')
    redis = new Redis(REDIS_ADDRESS)

    redis.on('connect', () => {
      console.log('Redis connected')
    })
    redis.on('error', (error: any) => {
      console.error('Redis error', error)
    })
    redis.on('close', () => {
      console.log('Redis connection closed')
    })
    redis.on('reconnecting', () => {
      console.log('Redis reconnecting')
    })
  } catch (error) {
    console.error(error)
  }
}

export const getObject = async (key: string) => {
  let result
  try {
    const rawResult = await get(key)
    result = JSON.parse(rawResult)
  } catch (err) {
    console.error(err)
  }
  return result
}

export const get = async (key: string) => {
  let result
  try {
    result = await redis.get(key)
  } catch (err) {
    console.error(err)
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
  console.log('Enabling monitoring')
  const redisMonitorConnection = new Redis(REDIS_ADDRESS)
  redisMonitorConnection.monitor((err, monitor) => {
    if (err) {
      console.error(err)
    }
    monitor.on('monitor', (time, args, source, database) => {
      console.log(`${time} - DB: ${database}: SRC - ${source} - ARGS: ${args}`)
    })
  })
}
