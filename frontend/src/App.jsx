import React from 'react'
import RoutingProvider from './services/routingProvider'
import { Toaster } from 'react-hot-toast'
import useCurrentUser from './hooks/useCurrentUser'

export const ServerURl =import.meta.env.VITE_SERVER_URL|| "http://localhost:3000";

const App = () => {
  useCurrentUser()

  return (
    <>
      <RoutingProvider />
      <Toaster
        position='top-right'
        reverseOrder={false}
      />

    </>


  )
}

export default App
