import ApolloClient from 'apollo-boost'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import Todos from './Todos'

const client = new ApolloClient({
  uri: 'http://localhost:3000'
})

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app</h2>
      <Todos />
    </div>
  </ApolloProvider>
)

export default App
