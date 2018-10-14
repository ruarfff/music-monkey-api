import { DataSource } from 'apollo-datasource'
import * as service from './userService'

export  class UserDataSource extends DataSource {
  public async getUserById(userId: string) {
    return await service.getUserById(userId)
  }
}
