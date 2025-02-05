import axios from 'axios';
import React, {  useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUpForm = () => {

  const [isSignUp, setSignUp] = useState(false)
  const location = useLocation();

  const {user} = location.state || {};
  
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
    setIsLoading(true);
    setError(null);
    
    try {

      const response = await axios.post('http://localhost:3000/auth/signup', {
        ...formData,
        examType: formData.examType.toUpperCase()
      });

      if (response.data) {
        // Show success message
        alert('Sign up successful!');
        // console.log(response) // checking what ir has
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          examType: '',
        });
        // Redirect to login
        navigate('/login', {state:{user: user}});  // student url + id require to fixthis
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(
        error.response?.data?.message || 
        'An error occurred during signup. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-l from-pink-100 to-cyan-200 justify-center px-6 py-12 lg:px-8 ">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
      <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Create Your Account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-7 bg-white border border-gray-300 rounded-xl shadow-lg ">
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

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
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Note: remember username and password <br/>
        Already have an Account?
        <Link to="/login" 
          state={{user : 'user'}}
          className="font-semibold text-indigo-600 hover:text-indigo-500">
          Log In
        </Link>
      </p>
    </div>
  </div>
  )
}

export default SignUpForm