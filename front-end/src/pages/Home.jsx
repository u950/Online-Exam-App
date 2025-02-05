import React from 'react'
import logo1 from '/images/image 21.png'
import logo2 from '/images/Group 2@2x.png'
import { Link } from 'react-router-dom'


const Home = () => {

  const navItems = [
    {id: 1, name:'Home', href: '/', current: true},
    {id: 2, name: 'About Us', href: '/'},
    {id: 2, name: 'Blog', href: '/'},
    {id: 2, name: 'Contact', href: '/'},
  ]


  return (
    <div className='flex size-full flex-col items-center' >
      <div className="flex h-20 w-full bg-gray-200 border-2 ">
          <div id="logo" className="flex relative p-4 w-1/5">
            <span className='flex flex-row justify-center gap-2'>
              <img src={logo1} alt="logo1" className='h-12 object-center'/>
              <img src={logo2} alt="logo2" className='h-12'/>
            </span>
          </div>
          <div className="justify-center flex p-7">
            {navItems.map((item,id)=>(
                <h5 className='ml-7 cursor-pointer'>{item.name}</h5>
            ))}
          </div>

            <div className='p-4 ml-3 align-center'>
              <select name="sign in" id="login"
                className='p-2 rounded-lg border-2 cursor-pointer hover:border-blue-400'
              >
                <option value="login">Sign IN as</option>
                <option value="user">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
      </div>
      
    </div>
  )
}

export default Home
