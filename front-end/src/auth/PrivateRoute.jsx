import React, { useEffect } from 'react'
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const PrivateRoute = ({ allowedRoles }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: location.pathname } })
            return
        }

        try {
            const decoded = jwtDecode(token)
            const { role, exp } = decoded

            if (Date.now() >= exp * 1000) {
                localStorage.removeItem('token')
                navigate('/login', { state: { from: location.pathname, message: 'Session expired. Please log in again.' } })
                return
            }

            if (!allowedRoles.includes(role)) {
                navigate('/unauthorized', { state: { from: location.pathname } })
            }
        } catch (error) {
            console.error('Error decoding token:', error)
            localStorage.removeItem('token')
            navigate('/login', { state: { from: location.pathname, message: 'Invalid token. Please log in again.' } })
        }
    }, [token, navigate, location, allowedRoles])

    if (!token) {
        return null // or a loading spinner
    }

    return <Outlet />
}

export default PrivateRoute
