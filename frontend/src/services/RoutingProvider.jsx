import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { useSelector } from 'react-redux'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
// import EditProfile from '../pages/EditProfile'


const RoutingProvider = () => {

    const { userData  ,loading} = useSelector((state) => state.user)



    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <Routes>
            <Route path='/register' element={!userData ? <Register /> : <Navigate to={"/"} />} />
            <Route path='/login' element={!userData ? <Login /> : <Navigate to={"/"} />} />
            <Route path='/' element={userData ? <Home /> : <Navigate to={"/login"} />} />
            <Route
                path='/profile'
                element={userData ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
                path='/edit-profile'
                element={userData ? <EditProfile /> : <Navigate to="/login" />}
            />
        </Routes>

    )
}

export default RoutingProvider
