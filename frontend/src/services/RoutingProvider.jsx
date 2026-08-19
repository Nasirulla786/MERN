import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Login from '../pages/Login'
// import Login from '../pages/Login'

const RoutingProvider = () => {
    return (
        <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
        </Routes>

    )
}

export default RoutingProvider
