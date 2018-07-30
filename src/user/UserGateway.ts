import { Promise } from 'es6-promise'
import { IUser, User } from '../model'

export default class UserGateway {
  public getOrCreateUser(user: IUser, strategy: string) {
    return new Promise((resolve, reject) => {
      this.getUserByEmail(user.email)
        .then((savedUser: IUser) => {
          if (strategy === 'spotify') {
            if (savedUser.spotifyId && savedUser.spotifyId !== user.spotifyId) {
              console.error(
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
                spotifyAuth: user.spotifyAuth
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
          resolve(userModel)
        }
      })
    })
  }

  public updateUser(user: IUser) {
    return new Promise((resolve, reject) => {
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

  public getUserById(userId: string) {
    return new Promise((resolve, reject) => {
      User.query(userId)
        .limit(1)
        .exec((err: Error, userModel: any) => {
          if (err || userModel.Count < 1) {
            console.error(err)
            reject(err)
          } else {
            const user = userModel.Items[0].attrs
            resolve(user)
          }
        })
    })
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
