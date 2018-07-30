import { Promise } from 'es6-promise'
import UserGateway from './UserGateway'

const userGateway: UserGateway = new UserGateway()
export default class UserService {
  public getUserById(userId: string) {
    return new Promise((resolve, reject) => {
      userGateway
        .getUserById(userId)
        .then(resolve)
        .catch(reject)
    })
  }
}
