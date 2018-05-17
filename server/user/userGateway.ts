import { Promise } from 'es6-promise'
import { IUser, User } from '../model'

export default class UserGateway {
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
        return resolve(userModel)
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
      console.log(userId)
      User.query(userId)
        .limit(1)
        .exec((err: Error, userModel: any) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            const user = userModel.Items[0].attrs
            resolve(user)
          }
        })
    })
  }

  public getUserByEmail(user: IUser) {
    return new Promise((resolve, reject) => {
      User.query(user.email)
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
