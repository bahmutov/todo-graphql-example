import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client'

// adding custom header with the GraphQL operation name
// https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const operationNameLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => ({
    headers: {
      'x-gql-operation-name': operation.operationName,
      ...headers,
    },
  }))
  return forward(operation)
})

const httpLink = new HttpLink({ uri: 'http://localhost:3000' })

export const client = new ApolloClient({
  link: concat(operationNameLink, httpLink),
  fetchOptions: {
    mode: 'no-cors',
  },
  cache: new InMemoryCache(),
})
