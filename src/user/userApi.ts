import { gql } from 'apollo-server-express'
import { getAllEventsUserWasInvitedTo } from '../event/userEventService'
import IUser from './model/IUser'
import { getUserById } from './userService'

export const typeDef = gql`
  extend type Query {
    user(userId: String!): User
  }
  type User {
    userId: String
    eventsInvitedTo: [Event!]!
  }
`
export const resolvers = {
  Query: {
    user: async (_root: any, { userId }: any) => {
      console.log(userId)
      return getUserById(userId)
    }
  },
  User: {
    eventsInvitedTo: async (user: IUser) => {
      return getAllEventsUserWasInvitedTo(user.userId)
    }
  }
}
