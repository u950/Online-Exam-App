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
import PrivateRoute from './auth/PrivateRoute'
import { NotFount } from './pages/NotFound'

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
        <Route element={<PrivateRoute/>}>
          
          <Route path='/admin-dashboard/:id' element={<AdminDashBoard/>}/>
          <Route path='/admin-setQuestions' element={<QuestionForm/>}/>
          <Route path='/admin/setTest' element={<GetQuestions/>}/>
        </Route>
        {/* private routes for student */}
        <Route element={<PrivateRoute/>}>
          <Route path='/student-dashboard/:id' element={<StudentDashBoard/>}/>
        </Route>
        <Route index element={<Home/>}/>
        <Route path='*' element={<NotFount/>}/>
      </Routes>
    </div>
  )
}

export default App