import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { logo } from '../../../public/logo';
import { jwtDecode } from 'jwt-decode';



const LoginForm = () => {

  const location = useLocation();
  const {user} = location.state || {};

  const [response, setResponse]= useState("");  // local variable

  const navigate= useNavigate();
  const [isLoggedIn, setLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target; // ✅ Corrected destructuring
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError(null);
    // console.log('Login form submitted data', formData);

    try {
      if(!user){
        alert('Select valid user!')
        navigate('/')
      }

      const { username } = formData; // Ensure username is defined

      if(user === 'user'){
        const response = await axios.post('http://localhost:3000/auth/login', formData)

        if(response){
          const token = response.data.token

          localStorage.setItem('token', token)
          const decoded = jwtDecode(token);
          const {role, id} = decoded;

          if(role === 'user')
            navigate(`/student-dashboard/${id}`, {state: {username}}) // Pass username correctly
          else setError("UnAuthorized access")
        } else{
          setError("unable fetch data..")
        }
      } else if(user === 'admin'){
        const response = await axios.post('http://localhost:3000/admin/login', formData)

        if(response ){
          const token = response.data.token
          // const id = response.data.id
          localStorage.setItem('token', token)
          const decoded = jwtDecode(token)
          const {role, id}= decoded
          
          // console.log('id of admin',)
          console.log('role admin', role)

          if(role === 'admin'){
            console.log('Admin login success')
            navigate(`/admin-dashboard/${id}`)
          }
          else setError("UnAuthorized Admin access")
        } else{
          setError('Unable fetch Admin data')
        }
      }

      setFormData({
        username: '',
        password: '',
      });

      setLogin(true)
    } catch (error) {
      console.error('Login error' || error.message)
      setError(error.message || "Something went wrong")
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-l from-purple-100 to-cyan-200 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex-row">
        <img className="mx-auto h-20 w-auto mix-blend-multiply" src={logo} alt="Company Logo"/>
        
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {user === 'admin' ? 'Log In to your Admin account' : 'Log In to your Account'}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          {user === 'admin' ? "" : <p className="mt-10 text-center text-sm text-gray-500">
            Not registered yet?{' '}
            <a href="/sign-up" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create an account
            </a>
          </p>}
          
          {isLoggedIn && (
            <div className="mt-4 p-3 text-sm text-green-600 bg-green-50 rounded-lg text-center">
              Login successful! Redirecting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
