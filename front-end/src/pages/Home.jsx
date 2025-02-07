import React, { useState } from 'react'
import logo1 from '/images/image 21.png'
import logo2 from '/images/Group 2@2x.png'
import { Link, useNavigate } from 'react-router-dom'
import frame from '/public/images/Frame 1171275256.svg'
import fram2 from '/public/images/Group 1000004163.svg'
import fram3 from '/public/images/Group 1000004164.svg'
import fram4 from '/public/images/Group 1000004162.svg'
import fram5 from '/public/images/Group 48096506.svg'

const Home = () => {
  const navigate = useNavigate()

  const navItems = [
    {id: 1, name: 'Home', href: 'hero', current: true},
    {id: 2, name: 'Whats There', href: 'about'},
    {id: 3, name: 'How It works', href: 'blog'},
    {id: 4, name: 'Contact', href: 'contact'},
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
  if(localStorage.getItem('token'))
    localStorage.removeItem('token')

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <div className="flex h-20 w-full items-center justify-between bg-white shadow-sm px-6 fixed top-0 z-50">
        <div id="logo" className="flex items-center">
          <span className='flex items-center gap-2'>
            <img src={logo1} alt="logo1" className='h-12 w-auto object-contain'/>
            <img src={logo2} alt="logo2" className='h-12 w-auto object-contain'/>
          </span>
        </div>

        <nav className="flex items-center space-x-8">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => scrollToSection(item.href)}
              className={`text-sm font-medium transition-colors hover:text-blue-600
                ${item.current ? 'text-blue-600' : 'text-gray-700'}`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className='flex items-center'>
          <select
            name="sign in"
            id="login"
            onChange={handleChange}
            className="p-2 rounded-lg bg-indigo-600 text-white font-bold border border-gray-300 hover:border-indigo-600 hover:border-3 cursor-pointer"
          >
            <option value="" className='bg-gray-100 text-black'>Sign In As</option>
            <option value="user" className='bg-gray-100 text-black'>Student</option>
            <option value="admin" className='bg-gray-100 text-black'>Admin</option>
          </select>
        </div>
      </div>

      <section id="hero" className="pt-20">
        <div className="size-full flex flex-col">
          <img src={frame} alt="frame"/>
        </div>
      </section>

      <section id="about" className="pt-20">
        <div className="flex flex-col size-full justify-center p-3 bg-gray-100">
          <div className="flex p-10 mt-4 flex-col justify-center">
            <h1 className='text-7xl font-serif justify-center p-6'>what's inside</h1>
            <img src={fram2} alt="f2" className='p-3 '/>
            <img src={fram3} alt="f3" className='p-3 '/>
          </div>
        </div>
      </section>

      <section id="blog" className="pt-20">
        <div className='p-10'>
          <h1 className='text-7xl font-mono p-5'>How it Works</h1>
          <img src={fram4} alt="f4" className='p-10 '/>
          <img src={fram5} alt="f5" className=''/>
        </div>
      </section>

    </div>
  )
}

export default Home
