import { promisify } from 'util'
import { logError } from '../logging'
import { User } from '../model'
import cleanModel from '../model/cleanModel'
import IUser from './IUser'

export const saveUser = (user: IUser) => {
  return new Promise((resolve, reject) => {
    User.create(user, (err: Error, userModel: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(cleanModel(userModel.attrs))
      }
    })
  })
}

export const modifyUser = (user: IUser) => {
  return new Promise<IUser>((resolve, reject) => {
    User.update(user, (err: any, userModel: any) => {
      if (err) {
        return reject(err)
      }
      return resolve(cleanModel(userModel.attrs))
    })
  })
}

export const destroyUser = (userId: string) => {
  return new Promise((resolve, reject) => {
    User.destroy(userId, (err: Error) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

export const fetchUserById = async (userId: string) => {
  let user: IUser
  try {
    const { attrs } = await promisify(User.get)(userId)
    user = cleanModel(attrs)
  } catch (err) {
    logError('Error fetching user by ID', err)
    throw err
  }
  return user
}

export const fetchUserByEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    User.query(email)
      .usingIndex('EmailIndex')
      .limit(1)
      .exec((err: any, userModel: any) => {
        if (err || userModel.Items.length < 1) {
          return reject(err)
        }
        return resolve(cleanModel(userModel.Items[0].attrs))
      })
  })
}

export const fetchOrCreateUser = (user: IUser, strategy: string) => {
  return new Promise((resolve, reject) => {
    fetchUserByEmail(user.email)
      .then((savedUser: IUser) => {
        if (strategy === 'facebook') {
          if (
            savedUser.facebookId &&
            savedUser.facebookId !== user.facebookId
          ) {
            logError(
              `Invalid Facebook account link: email: ${
                user.email
              }, incoming facebookId: ${user.facebookId}, saved facebookId: ${
                savedUser.facebookId
              }`
            )
            reject('This Facebook account has been linked to another account')
          } else {
            savedUser = {
              ...savedUser,
              facebookId: user.facebookId,
              facebookAuth: user.facebookAuth,
              displayName: savedUser.displayName || user.displayName,
              image: savedUser.image || user.image
            }
            modifyUser(savedUser)
              .then(resolve)
              .catch(reject)
          }
        } else if (strategy === 'spotify') {
          if (savedUser.spotifyId && savedUser.spotifyId !== user.spotifyId) {
            logError(
              `Invalid Spotify account link: email: ${
                user.email
              }, incoming spotifyId: ${user.spotifyId}, saved spotifyId: ${
                savedUser.spotifyId
              }`
            )
            reject('This Spotify account has been linked to another account')
          } else {
            savedUser = {
              ...savedUser,
              spotifyId: user.spotifyId,
              spotifyAuth: user.spotifyAuth,
              displayName: savedUser.displayName || user.displayName,
              image: savedUser.image || user.image
            }
            modifyUser(savedUser)
              .then(resolve)
              .catch(reject)
          }
        } else {
          resolve(savedUser)
        }
      })
      .catch(() => {
        saveUser(user)
          .then(resolve)
          .catch((err: Error) => {
            // TODO: for some reason if I just do  .catch(reject) it doesn't work. Should figure out why... someday
            reject(err)
          })
      })
  })
}
