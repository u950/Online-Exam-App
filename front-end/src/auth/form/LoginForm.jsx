import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logo } from '../../../public/logo';

const LoginForm = () => {
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
    e.preventDefault(); // ✅ Fixed typo
    setError(null);
    console.log('Login form submitted data', formData);

    try{
      const response = await axios.post('http://localhost:3000/account/login', formData)
      console.log('login success', response.data)
      
      setFormData({
      username: '',
      password: '',
    });
    // store token for authentication
    if(response.data.token) {
      localStorage.setItem('token', response.data.token);
      setLogin(true);
    }
    // navigate to home page or dash board
    navigate('/');

    } catch (error) {
      console.error('Login error', error.response?.data || error.message)
      setError(error.response?.data?.message || "something went wrong")
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" src={logo} alt="Your Company"/>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-8 bg-white border border-gray-300 rounded-lg shadow-lg ">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Quote: It's not about being the best, it's about being better than you were yesterday
          <br />
          <a href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Don't have an account? Sign up
          </a>
          {isLoggedIn && (
            <p className="text-green-600">Login success</p>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
