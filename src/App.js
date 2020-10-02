import React from 'react'
// import { ApolloProvider } from 'react-apollo'
import { ApolloProvider } from '@apollo/client'
import Header from './containers/Header'
import MainSection from './containers/MainSection'
import { client } from './graphql-client'

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Header />
      <MainSection />
    </div>
  </ApolloProvider>
)

export default App
