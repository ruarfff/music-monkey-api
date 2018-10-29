import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'
import { merge } from 'lodash'
import { resolvers as eventResolvers, typeDef as Event } from './event'
import { resolvers as userResolvers, typeDef as User } from './user'

const Query = gql`
  type Query {
    _empty: String
  }
`
const resolvers = {}
const schema = makeExecutableSchema({
  typeDefs: [Query, Event, User],
  resolvers: merge(resolvers, eventResolvers, userResolvers)
})

const graphqlServer = new ApolloServer({
  schema,
  introspection: true
})

export default (app: any) => {
  graphqlServer.applyMiddleware({ app })
}
