import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'
import { merge } from 'lodash'
import { resolvers as eventResolvers, typeDef as Event } from './event'

const Query = gql`
  type Query {
    _empty: String
  }
`
const resolvers = {}
const schema = makeExecutableSchema({
  typeDefs: [Query, Event],
  resolvers: merge(resolvers, eventResolvers)
})

const graphqlServer = new ApolloServer({
  schema
})

export default (app: any) => {
  graphqlServer.applyMiddleware({ app })
}
