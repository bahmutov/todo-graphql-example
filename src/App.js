import ApolloClient from 'apollo-boost'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import Header from './containers/Header'
import MainSection from './containers/MainSection'

const client = new ApolloClient({
  uri: 'http://localhost:3000'
})

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Header />
      <MainSection />
    </div>
  </ApolloProvider>
)

export default App
