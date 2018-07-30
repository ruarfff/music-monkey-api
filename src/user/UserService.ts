import { Promise } from 'es6-promise'
import * as NodeCache from 'node-cache'
import { IUser } from '../model'
import UserGateway from './UserGateway'

const userCache = new NodeCache({ stdTTL: 600, checkperiod: 300 })

const userGateway: UserGateway = new UserGateway()
export default class UserService {
  public updateUser(user: IUser) {
    return userGateway.updateUser(user)
  }

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