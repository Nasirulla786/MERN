import React from 'react'
import RoutingProvider from './services/routingProvider'
import { Toaster } from 'react-hot-toast'

export const ServerURl = "http://localhost:3000"

const App = () => {

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
