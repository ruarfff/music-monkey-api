import { gql } from 'apollo-server-express'

export const typeDef = gql`
  extend type Query {
    event(eventId: String!): Event
  }
  type Event {
    eventId: String!
    userId: String!
  }
`
export const resolvers = {
  Query: {
    event: () => ({})
  }
}
