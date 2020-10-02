// import ApolloClient from 'apollo-boost'
import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'http://localhost:3000',
  cache: new InMemoryCache(),
})
