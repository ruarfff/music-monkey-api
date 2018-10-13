import { ApolloServer, gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world'
  }
}

const graphqlServer = new ApolloServer({ typeDefs, resolvers })

export default (app: any) => {
  graphqlServer.applyMiddleware({ app })
}
