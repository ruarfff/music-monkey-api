import { gql } from 'apollo-server-express'

export const typeDef = gql`
  extend type Query {
    event(id: String!): Event
  }
  type Event {
    id: String
  }
`
export const resolvers = {
  Query: {
    event: () => ({})
  }
}
