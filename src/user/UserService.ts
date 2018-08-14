import * as cache from '../cache'
import { logError } from '../logging'
import { IUser } from '../model'
import UserGateway from './UserGateway'

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
    const uuidv1 = require('uuid/v1')
    return userGateway.createUser({
      isGuest: true,
      email: uuidv1() + '@temp.com'
    } as IUser)
  }

  public async updateUser(user: IUser) {
    let updatedUser: IUser
    try {
      updatedUser = await userGateway.updateUser(user)
      cache.setObject(user.userId, user)
    } catch (err) {
      logError('Error updating user', err)
    }
    return updatedUser
  }

  public getUserByEmail(email: string) {
    return userGateway.getUserByEmail(email)
  }

  // We use an in memory cache here since this lookup is done on most requests
  // TODO: Move to caching service.
  public async getUserById(userId: string) {
    let user: IUser
    try {
      user = await cache.getObject(userId)
      if (!user) {
        user = await userGateway.getUserById(userId)
        cache.setObject(user.userId, user)
      }
    } catch (err) {
      logError('Error getting user by IDs', err)
    }
    return user
  }
}
