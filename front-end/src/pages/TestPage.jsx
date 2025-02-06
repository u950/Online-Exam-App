
import React,{useContext, useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { Boxes } from '../components/TestPageComponents';
// import { Alert, Button } from "@material-tailwind/react";
import axios from 'axios'



const Infobox =[
  {id:1, name:"Not Visited", color: "bg-gray-400"},
  {id:2, name:"Un Answeres",color: "bg-yellow-400"},
  {id:3, name:"Answered", color: "bg-green-500"},
  {id:4, name:"Review", color : "bg-blue-500"},
  {id:5, name:"Review with answered", color: "bg-violet-500"}
]




const TestPage = () => {
    const location = useLocation();
    const {data} = location.state || {}

    // data ? console.log(data) : ""

    const [loading, setLoading] = useState(false)
    const [Mathematics , setmMaths] = useState(data.subjects[0] || {});  // check whether data exits or not
    const [physics, setPhysics] = useState(data.subjects[1] || {})
    const [Chemistry, setChemistry] = useState(data.subjects[2] || {})

    // const [selectedSubject, setSelectedSubject] = useState('')
    const [currentSubject, setCurrentSubject] = useState(Mathematics);

    const [questionNumber , setQuestionNumber] = useState('')
    const [questions, setQuestion] = useState([]); // storing questions from backend

    const [option ,setOption] = useState(null)
    const [colorToggle, setColorToggle] = useState('')

    const [openAlert, setOpenAlert] = useState(false);

    // console.log('maths question', Maths)
    // console.log(Maths.questions.length)
    const handleSelectchange=(e)=>{
      const {value }= e.target;
      // setSelectedSubject(value)
      // console.log('value',value) here current subject geeting after value 
      setOpenAlert(true)
      
      if(value === 'Mathematics')
        setCurrentSubject(Mathematics)
      else if(value === 'Physics')
        setCurrentSubject(physics)
      else if(value === 'Chemistry')
        setCurrentSubject(Chemistry)
      else
        setCurrentSubject('')
      
      
      
    }
    // console.log(currentSubject);



    const handleQuestionClick=(item, index)=>{
      setOption(null)

      const n = index +1
      setQuestionNumber(n)
      // console.log('item clicked ',item)
      const fetchQuestion = async()=>{
        setLoading(true)
        try{
          const response = await axios.get(`http://localhost:3000/user/testpage/${item}`)
          if(!response.data){
            console.log('question not found', response.message)
          }
          setQuestion(response.data.question)
          // console.log('question fetched successfully', response.data.question)

        }catch(error){
          console.log('error fetching question', error)
        } finally{
          setLoading(false)
        }
      }

      fetchQuestion();  // call the functions to fetch data store
    }


    const handleOptionChange=(index)=>{

      // console.log(index+1)
      setOption(index+1);
      setColorToggle('border-solid border-green-400')
      // console.log('option value', option)
    }

    useEffect(()=>{
      setOpenAlert(true)
    },[])


    // console.log('question content ',questions.options)
  return (
    <div className='flex flex-col gap-4 justify-center '>
      <div className="flex flex-row h-20 justify-around bg-gradient-to-r from-fuchsia-500 to-cyan-500">
        <h1 className='text-center p-6 text-white font-semibold font-sans text-3xl'> {data.examType} - Subject - {currentSubject.name}</h1>
        <div className='flex p-4 '>
          <select 
            name="subject" 
            id="subject"
            className='rounded-lg p-2'
            onChange={handleSelectchange}  
          >

            <option id="subject1" value="Mathematics">Mathematics</option>
            <option id="subject2" value="Physics">Physics</option>
            <option id="subject2" value="Chemistry">Chemistry</option>
          </select>
        </div>
          {
            openAlert && (
              <div className='fixed right-4 top-2 bg-red-500 p-3 rounded-lg flex text-white'
              >
                <p >! Subject changed please select a question now !!</p>
                <button 
                  className='bg-blend-color-dodge px-3'
                  onClick={()=> setOpenAlert(false)}
                >
                  ✖
                </button>
              </div>
            )
          }

      </div>
      <div className='flex justify-between'>
        <div className='absolute w-3/5 flex flex-row justify-between p-3 px-4 ml-12 bg-gray-100 border-3 shadow-md'>
          <div className="p-2">Timer</div>
          <button
            className='p-2 rounded-lg border-2 border-indigo-500 bg-indigo-600 text-white font-mono font-semibold hover:border-3 hover:bg-indigo-500 shadow-lg'
          >submit</button>
        </div>
        
        <div className="flex w-2/3  h-dvh p-5 ml-2">
            <div id="question container" className="flex size-full bg-gray-50 p-5 border-3 border-gray-400">
              <div className="flex flex-col align-middle gap-10 w-full relative  mt-10 p-2">
                <h1 className='text-xl font-serif '>
                  {questionNumber} )  {questions.questionText}
                   
                </h1>
                <div className="flex flex-col ">
                  {
                    questions.options?.map((item, idx)=>(
                      <div key={idx} 
                        className={` flex p-5 border-2 border-solid rounded-lg hover:border-gray-400`}
                      >
                        <input type="checkbox"
                          value={idx + 1}
                          checked={option === idx+1}
                          onChange={()=>handleOptionChange(idx)}
                        />
                        <h1 className='px-3'>{item}</h1>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            
        </div>
        <div className="flex w-1/3 h-dvh p-5 ml-2 bg-gray-100">
            <div className="flex flex-col size-full bg-white border-4 ">
              <div className="h-1/3  w-full grid grid-cols-2 gap-5 p-5 ">
                  {
                    Infobox.map((item, index)=>(
                      <Boxes name={item.name} color={item.color} key={index}/>
                    ))
                  }
              </div>
              <div id="questions" className=" grid grid-cols-5 gap-1 p-3 h-2/3  w-full overflow-auto ">
              {
                currentSubject.questions && currentSubject.questions.map((item, index)=>(
                  <button
                  key={index}
                  className='flex '
                  id='question-btn'
                  
                  onClick={()=>handleQuestionClick(item, index)}
                >
                    <div
                        className={` box-content size-5 rounded-lg p-4 mr-2 items-center bg-green-100 hover:border-2 hover:border-green-400`}
                    >
                    {index + 1}
                    </div>
                </button>
                ))
              }

              </div>
            </div>
        </div>
    </div>
    </div>
  )
}





export default TestPage

