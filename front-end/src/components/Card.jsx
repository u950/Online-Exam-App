import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = (props) => {

    const { image, data ,studentId, studentName} = props;
    const navigate = useNavigate();
    // const id = data._id
    // const name = data.title

    const handleClick =()=>{
        navigate('/student/test/instruction', {state: {data:data, userId: studentId, studentName: studentName}})  // sending userId to testpage
    }
  return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-105">
        <a href="#">
            <img className="rounded-t-lg" src={image} alt="testimg" />
        </a>
        <div className="p-5 items-center justify-center">
            <a href="#" >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data.title}</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{data.description}</p>
            <button 
                onClick={handleClick} 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Take Test
            </button>
        </div>
    </div>

  )
}

export default Card
