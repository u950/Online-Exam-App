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
import TestInstruction from './components/Testinstruction'
import TestPage from './pages/TestPage'

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
        <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
          
          <Route path='/admin-dashboard/:id' element={<AdminDashBoard/>}/>
          <Route path='/admin-setQuestions' element={<QuestionForm/>}/>
          <Route path='/admin/setTest' element={<GetQuestions/>}/>
        </Route>
        {/* private routes for student */}
        <Route element={<PrivateRoute allowedRoles={['user']}/>}>
          <Route path='/student-dashboard/:id' element={<StudentDashBoard/>}/>
          <Route path='/student/test/instruction' element={<TestInstruction/>}/>
          <Route path='/student/testpage/:id' element={<TestPage/>}/>
        </Route>
        <Route index element={<Home/>}/>
        <Route path='*' element={<NotFount/>}/>
      </Routes>
    </div>
  )
}

export default App