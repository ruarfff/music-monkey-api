import { RedisCache } from 'apollo-server-cache-redis'
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'
import { merge } from 'lodash'
import { resolvers as eventResolvers, typeDef as Event } from './event'
import { resolvers as userResolvers, typeDef as User } from './user'
const REDIS_ADDRESS = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'

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
  cache: new RedisCache({
    host: REDIS_ADDRESS
    // Options are passed through to the Redis client
  }),
  introspection: true
})

export default (app: any) => {
  graphqlServer.applyMiddleware({ app })
}
