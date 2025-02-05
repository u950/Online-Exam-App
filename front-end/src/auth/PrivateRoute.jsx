import React, { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const PrivateRoute = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const decode = jwtDecode(token)
    const {role} = decode
    
    if(!token) return navigate('/login', {state: {user: role}})
    

    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default PrivateRoute
