import { Promise } from 'es6-promise'
import * as NodeCache from 'node-cache'
import { IUser } from '../model'
import UserGateway from './UserGateway'

const userCache = new NodeCache({ stdTTL: 600, checkperiod: 300 })

const userGateway: UserGateway = new UserGateway()
export default class UserService {
  // NOTE: Funny looking flow here but success if user not found basically.
  public createNewUser(user: IUser): any {
    return new Promise((resolve, reject) => {
      userGateway
        .getUserByEmail(user.email)
        .then((foundUser: IUser) => {
          reject(
            'A user with the email ' + foundUser.email + ' already exists.'
          )
        })
        .catch((err: any) => {
          if (!err) {
            userGateway
              .createUser(user)
              .then(resolve)
              .catch(reject)
          } else {
            reject(err)
          }
        })
    })
  }
  public createGuest() {
    return userGateway.createUser({} as IUser)
  }

  public updateUser(user: IUser) {
    return userGateway.updateUser(user)
  }

  public getUserByEmail(email: string) {
    return userGateway.getUserByEmail(email)
  }

  // We use an in memory cache here since this lookup is done on most requests
  // TODO: Move to caching service.
  public getUserById(userId: string) {
    return new Promise((resolve, reject) => {
      userCache.get(userId, (err: any, value: any) => {
        if (value === undefined || err) {
          userGateway
            .getUserById(userId)
            .then(user => {
              userCache.set(userId, user, (cacheErr: any) => {
                if (cacheErr) {
                  console.error('Failed to cache user', err)
                }
              })
              resolve(user)
            })
            .catch(reject)
        } else {
          resolve(value)
        }
      })
    })
  }
}
