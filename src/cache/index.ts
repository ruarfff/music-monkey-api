import * as redisGateway from '../redis/redisGateway'

export const get = redisGateway.get
export const set = redisGateway.set
export const del = redisGateway.del
export const getObject = redisGateway.getObject
export const setObject = redisGateway.setObject

export default { get, set, del, getObject, setObject }
