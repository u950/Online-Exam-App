import React, { useState } from 'react'
import logo1 from '/images/image 21.png'
import logo2 from '/images/Group 2@2x.png'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const navItems = [
    {id: 1, name: 'Home', href: '/', current: true},
    {id: 2, name: 'About Us', href: '/about'},
    {id: 3, name: 'Blog', href: '/blog'},
    {id: 4, name: 'Contact', href: '/contact'},
  ]

  const handleChange = (e) => {
    const { value } = e.target
    if (value === 'user') {
      navigate('/sign-up', { state: { user: 'user' } })
    } else if (value === 'admin') {
      navigate('/login', { state: { user: 'admin' } })
    }
    // If neither 'user' nor 'admin' is selected, do nothing
  }

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <div className="flex h-20 w-full items-center justify-between bg-white shadow-sm px-6">
        <div id="logo" className="flex items-center">
          <span className='flex items-center gap-2'>
            <img src={logo1} alt="logo1" className='h-12 w-auto object-contain'/>
            <img src={logo2} alt="logo2" className='h-12 w-auto object-contain'/>
          </span>
        </div>

        <nav className="flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.id}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600
                ${item.current ? 'text-blue-600' : 'text-gray-700'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className='flex items-center'>
          <select
            name="sign in"
            id="login"
            onChange={handleChange}
            className="p-2 rounded-lg border border-gray-300 hover:border-indigo-600 hover:border-3 cursor-pointer"
          >
            <option value="">Sign in as</option>
            <option value="user">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Home
