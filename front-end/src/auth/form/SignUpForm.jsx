import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    examType: ""
  })
  
  const handleOnChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submitted form sign up');
    try{
      const response = await axios.post('http://localhost:3000/account/sign-up', formData)
      if(response.status !== 200){
        console.log('error sign up')
        alert('sign not successfull')
      }

      alert('sign up successful')
      setFormData({
        username: '',
        email:'',
        password:'',
        examType:'',
      })
      navigate('/login')

    } catch(e) {
      console.log('error sign up', response.data?.error)

    }

  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
      <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Create Your Account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-7 bg-white border border-gray-300 rounded-xl shadow-lg ">
      <form onSubmit={handleSubmit} 
        className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900">
            Username
          </label>
          <div className="mt-2">
            <input
              type="username"
              name="username"
              id="username"
              autoComplete="username"
              required
              value={formData.username} // ✅ Uncommented
              onChange={handleOnChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={formData.email} // ✅ Uncommented
              onChange={handleOnChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              required
              value={formData.password} // ✅ Uncommented
              onChange={handleOnChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Exam Name
          </label>
          <div className="mt-2">
            <input
              type="examType"
              name="examType"
              id="examType"
              autoComplete="username"
              placeholder='JEE / NEET in caps lock'
              required
              value={formData.examType} // ✅ Uncommented
              onChange={handleOnChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary"
          >
            Sign Up
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Already have an Account?
        <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Log In
        </a>
      </p>
    </div>
  </div>
  )
}

export default SignUpForm