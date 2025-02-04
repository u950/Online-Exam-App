import React from 'react'
import { Routes,Route } from 'react-router-dom'
import LoginForm from './auth/form/LoginForm'
import SignUpForm from './auth/form/SignUpForm'
import AuthLayout from './auth/AuthLayout'
import Home from './pages/Home'
import AdminDashBoard from './pages/dashBoard/AdminDashBoard'
import StudentDashBoard from './pages/dashBoard/StudentdashBoard'
import QuestionForm from './components/UploadQuestion'
import GetQuestions from './components/SetTest'

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<AuthLayout/>}>
          {/* public routes */}
          <Route path='/login' element={<LoginForm />}/>
          <Route path='/sign-up' element={<SignUpForm />}/>
        </Route>
        {/* private routes */}
        <Route path="/" element={<Home/>}/>
        <Route path='/admin-dashboard' element={<AdminDashBoard/>}/>
        <Route path='/admin-setQuestions' element={<QuestionForm/>}/>
        <Route path='/student-dashboard' element={<StudentDashBoard/>}/>
        <Route path='/admin/setTest' element={<GetQuestions/>}/>
      </Routes>
    </div>
  )
}

export default App