// import { Promise } from 'es6-promise'
import { logError } from '../logging'
import { IUser, User } from '../model'

export default class UserGateway {
  public getOrCreateUser(user: IUser, strategy: string) {
    return new Promise((resolve, reject) => {
      this.getUserByEmail(user.email)
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
              this.updateUser(savedUser)
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
              this.updateUser(savedUser)
                .then(resolve)
                .catch(reject)
            }
          } else {
            resolve(savedUser)
          }
        })
        .catch(() => {
          this.createUser(user)
            .then(resolve)
            .catch((err: Error) => {
              // TODO: for some reason if I just do  .catch(reject) it doesn't work. Should figure out why... someday
              reject(err)
            })
        })
    })
  }

  public createUser(user: IUser) {
    return new Promise((resolve, reject) => {
      User.create(user, (err: Error, userModel: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(userModel.attrs)
        }
      })
    })
  }

  public updateUser(user: IUser) {
    return new Promise<IUser>((resolve, reject) => {
      User.update(user, (err: any, userModel: any) => {
        if (err) {
          return reject(err)
        }
        return resolve(userModel.attrs)
      })
    })
  }

  public deleteUser(userId: string) {
    return new Promise((resolve, reject) => {
      User.destroy(userId, (err: Error) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }

  public async getUserById(userId: string) {
    let user: IUser
    try {
      user = await new Promise<IUser>((resolve, reject) => {
        User.query(userId)
          .limit(1)
          .exec((err: Error, userModel: any) => {
            if (err || userModel.Count < 1) {
              logError('Error fetching user by ID', err)
              reject(err)
            } else {
              resolve(userModel.Items[0].attrs)
            }
          })
      })
    } catch (err) {
      logError('Error fetching user by ID', err)
    }
    return user
  }

  public getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      User.query(email)
        .usingIndex('EmailIndex')
        .limit(1)
        .exec((err: any, userModel: any) => {
          if (err || userModel.Items.length < 1) {
            return reject(err)
          }
          return resolve(userModel.Items[0].attrs)
        })
    })
  }
}
