import cache from '../cache'
import { logError } from '../logging'
import ISafeUser from './model/ISafeUser'
import IUser from './model/IUser'
import {
  fetchOrCreateUser,
  fetchUserByEmail,
  fetchUserById,
  modifyUser,
  saveUser
} from './userGateway'

const cachedUserTTL = 600

export const removeCachedUser = (userId: string) => {
  cache.del(userId)
}

export const getOrCreateUser = async (user: IUser, strategy: string) => {
  return await fetchOrCreateUser(user, strategy)
}

export const createNewUser = async (user: IUser) => {
  const existingUser: IUser = await getUserByEmail(user.email)
  if (existingUser) {
    throw new Error(
      'A user with the email ' + existingUser.email + ' already exists.'
    )
  }

  const savedUser = await saveUser(user)

  return savedUser
}

export const createGuest = () => {
  const uuidv1 = require('uuid/v1')
  return saveUser({
    isGuest: true,
    email: uuidv1() + '@temp.com'
  } as IUser)
}

export const updateUser = async (user: IUser) => {
  let updatedUser: IUser = user
  try {
    updatedUser = await modifyUser(user)
    cache.setObject(updatedUser.userId, updatedUser, cachedUserTTL)
  } catch (err) {
    logError('Error updating user', err)
  }
  return updatedUser
}

export const getUserByEmail = async (email: string) => {
  return await fetchUserByEmail(email)
}

export const getUserById = async (userId: string) => {
  let user: IUser = await cache.getObject(userId)
  if (!user) {
    user = await fetchUserById(userId)
    cache.setObject(user.userId, user, cachedUserTTL)
  }

  return user
}

export const getSafeUserById = async (userId: string) => {
  const user = await getUserById(userId)
  return !!user
    ? ({
        country: user.country,
        displayName: user.displayName,
        image: user.image,
        userId: user.userId,
        isGuest: user.isGuest
      } as ISafeUser)
    : user
}
