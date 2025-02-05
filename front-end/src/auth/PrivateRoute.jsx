import React from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const PrivateRoute = () => {
    const token = localStorage.getItem('token')
    if(!token) return <Navigate to='/login' replace/>
    
    // const {id} = useParams();
    try {
        const decoded = jwtDecode(token)
        const { expiresIn, role ,_id} = decoded

        // Check if token is expiresInired
        if(Date.now() >= expiresIn * 1000) {
            localStorage.removeItem('token')
            return <Navigate to='/login' replace/>
        }

        // Route based on user role

        const path = location.pathname

        if(path === '/'){
            if(role === 'user'){
                return <Navigate to={`/student-dashboard/${_id}`}/>
            } else if(role === 'admin'){
                return <Navigate to={`/admin-dashboard/${_id}`}/>
            }
        }
        if(role === 'student' && path.startsWith('/admin') ) {
            return <Navigate to={`/student-dashboard/${_id}`} replace/>
        } else if(role === 'admin') {
            return <Navigate to={`/admin-dashboard/${_id}`} replace/>
        }
    } catch {
        localStorage.removeItem('token')
        return <Navigate to='/login' replace/>
    }

    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default PrivateRoute
