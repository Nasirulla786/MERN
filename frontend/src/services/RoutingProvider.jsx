import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { useSelector } from 'react-redux'


const RoutingProvider = () => {

    const {userData} = useSelector((state)=>state.user)

    return (
        <Routes>
            <Route path='/register' element={!userData?<Register />:<Navigate to={"/"} />} />
            <Route path='/login' element={!userData?<Login />:<Navigate to={"/"} />} />
            <Route path='/' element={userData?<Home />: <Navigate to={"/login"} />} />
        </Routes>

    )
}

export default RoutingProvider
