import React,{useContext, useEffect, useState, useCallback, useMemo} from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { Boxes } from '../components/TestPageComponents';
// import { Alert, Button } from "@material-tailwind/react";
import axios from 'axios'
import debounce from 'lodash/debounce'
import { DialogModal } from '../components/dialogModal';


const Infobox =[
  {id:1, name:"Not Visited", color: "bg-gray-400"},
  {id:2, name:"Un Answeres",color: "bg-yellow-400"},
  {id:3, name:"Answered", color: "bg-green-500"},
  {id:4, name:"Review", color : "bg-blue-500"},
  {id:5, name:"Review with answered", color: "bg-violet-500"}
]




const TestPage = () => {
    const location = useLocation();
    const {data, userId, studentName} = location.state || {}
    const {id} = useParams()
    // console.log('test Id',id)
    // console.log('user Id',userId)

    const navigate = useNavigate()
    const [testResponses, setTestResponses] = useState([]);
    // responses from user

    // data ? console.log(data) : ""

    const [loading, setLoading] = useState(false)
    const [Mathematics , setmMaths] = useState(data.subjects[0] || {});  // check whether data exits or not
    const [physics, setPhysics] = useState(data.subjects[1] || {})
    const [Chemistry, setChemistry] = useState(data.subjects[2] || {})

    // const [selectedSubject, setSelectedSubject] = useState('')
    const [currentSubject, setCurrentSubject] = useState(Mathematics);

    const [questionNumber , setQuestionNumber] = useState(1)
    const [questions, setQuestion] = useState([]); // storing questions from backend

    const [option ,setOption] = useState(null)
    const [colorToggle, setColorToggle] = useState('')

    const [openAlert, setOpenAlert] = useState(false);

    const [seenQuestion, setSeenQuestion] = useState([]); // check later change color for seen

    const [startTime, setStartTime] = useState(Date.now());
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [totalTimeTaken, setTotalTimeTaken] = useState(0);

    const [isSubmit, setIsSubmit] = useState(false);
    const [canSubmit ]= useState(false)

    const TOTAL_TIME = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

    useEffect(() => {
        let startTime = localStorage.getItem("testStartTime");

        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem("testStartTime", startTime);
        }

        const updateTimer = () => {
            const elapsed = Date.now() - parseInt(startTime);
            const remainingTime = Math.max(TOTAL_TIME - elapsed, 0);
            setTimeLeft(remainingTime);

            if (remainingTime <= 0) {
                submitTestFinal();
                clearInterval(timerInterval);
            }
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // function for tracking back button press
    // clearin browser history to clearing previuos pages


    // Add memoization for expensive computations
    const memoizedResponses = useMemo(() => {
        return testResponses.reduce((acc, curr) => {
            acc[curr.questionId] = curr;
            return acc;
        }, {});
    }, [testResponses]);

    // Add debouncing for save operation
    const debouncedSave = useCallback(
        debounce((questionId, selectedOptionIndex , correctOption) => {
            handleSave(questionId, selectedOptionIndex , correctOption);
        }, 300),
        []
    );

    // Optimize question fetching with caching
    const [questionCache, setQuestionCache] = useState({});

    const fetchQuestion = useCallback(async (questionId) => {
        if (questionCache[questionId]) {
            setQuestion(questionCache[questionId]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/user/testpage/${questionId}`);
            if (response.data) {
                const questionData = response.data.question;
                setQuestion(questionData);
                setQuestionCache(prev => ({
                    ...prev,
                    [questionId]: questionData
                }));
                // console.log('question data', questionData)
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        } finally {
            setLoading(false);
        }
    }, [questionCache]);

    const handleSave = (questionId, selectedOptionIndex , correctOption) => {
        if (selectedOptionIndex === null) {
            console.log('No option selected');
            return;
        }

        const questionTimeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
        
        setTestResponses(prev => {
            const existingResponses = Array.isArray(prev) ? prev : [];
            const existingResponseIndex = existingResponses.findIndex(
                resp => resp.questionId === questionId
            );

            const newResponse = {
                questionId: questionId,
                selectedOption: selectedOptionIndex ,
                timeTaken: questionTimeTaken,
                correct: selectedOptionIndex  === correctOption
            };

            // Log only when response is actually updated
            const updatedResponses = existingResponseIndex !== -1
                ? existingResponses.map((resp, index) => 
                    index === existingResponseIndex ? newResponse : resp
                  )
                : [...existingResponses, newResponse];
            
            return updatedResponses;
        });
    };

    // Remove the console.log after setTestResponses
    // console.log(' responses from save ', testResponses)

    // Add a useEffect to log responses only when they change
    useEffect(() => {
        if (testResponses.length > 0) {
            console.log('Updated responses:', testResponses);
        }
    }, [testResponses]);

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



    const handleQuestionClick=(item, index)=>{  // item is question Id
      setQuestionStartTime(Date.now()); // Reset timer for new question
      setOption(null)
      setSeenQuestion(prev =>
      [...new Set([...prev, item])]
      )      // setSeenQuestion(prev => [...new Set([...prev, item])]);
    
      const n = index +1
      setQuestionNumber(n)
      // console.log('item clicked ',item)
      fetchQuestion(item);  // call the functions to fetch data store
    }


    const handleOptionChange=(index)=>{

      // console.log(index+1)
      setOption(index+1);
      setColorToggle('border-solid border-green-400')
      // console.log('option value', option)
    }

    useEffect(()=>{
      // setCurrentSubject(Mathematics)
      setOpenAlert(true)
    },[])

    useEffect(() => {
        const timer = setInterval(() => {
            setTotalTimeTaken(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const submitTestFinal = async () => {
      
        try {
            setLoading(true)
            if (testResponses.length === 0) {
                console.log('No responses to submit');
                return;
            }
            setIsSubmit(true)
            const response = await axios.post(`http://localhost:3000/user/testSubmit/${id}`, {
                user: userId,
                responses: testResponses,
                timeTaken: totalTimeTaken
            });

            if (response.status === 201) {

                console.log('Test submitted successfully:', response.data.message);
                localStorage.removeItem('testStartTime');
                // Navigate to results page or show success message
                // navigate(`/student-dashBoard/${userId}`);
                
            }
        } catch (error) {
            console.error('Failed to submit test:', error);
            // Show error message to user
        } finally {
            setLoading(false)
        }
    };

    // console.log('question content ',questions._id)
    // console.log(localStorage.getItem('token'))
  return (
    <div className='flex flex-col gap-4 justify-center '>
      {
        loading && (
          <div className="flex-center absolute x-[100] h-dvh ">
                <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                </div>
            </div>
        )
      }
      <div className="flex flex-row h-20 justify-around bg-gradient-to-r from-fuchsia-500 to-cyan-500">
        <h1 className='text-center p-6 text-white font-semibold font-sans text-3xl'> 
          <span className='text-xl font-mono p-3'>👤 {studentName}</span>
          📚 {data.examType} - Subject - {currentSubject.name}
        </h1>
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
          {
            isSubmit && (
              <div>
              <DialogModal userId={userId}/>
                
              </div>
            )
          }

      </div>
      <div className='flex justify-between'>
        <div className='absolute w-3/5 flex flex-row justify-between p-3 px-4 ml-12 bg-gray-100 border-3 shadow-md'>
          <div className="p-2 font-mono font-semibold"> ⏳ {formatTime(timeLeft)}</div>
          <button
            className='p-2 rounded-lg border-2 border-indigo-500 bg-indigo-600 text-white font-mono font-semibold hover:border-3 hover:bg-indigo-500 shadow-lg'
            onClick={submitTestFinal}
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
                    questions.options?.map((item, idx)=>(   // item is question id
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
                {questions.options && <div className='flex'>
                  <button className=' bg-indigo-500 p-3 rounded-lg text-white border-2 hover:border-indigo-700'
                    id="save-btn"
                    onClick={()=> debouncedSave(questions._id, option-1 , questions.correctAnswer)}
                  >
                    Save
                  </button>
                </div> }
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
              <div id="questions" className=" grid grid-cols-5  p-3 h-2/3  w-full overflow-auto ">
              {
                currentSubject.questions && currentSubject.questions.map((item, index)=>(
                  <button
                  key={index}
                  className='flex '
                  id='question-btn'
                  
                  onClick={()=>handleQuestionClick(item, index)}
                >
                    <div
                        className={` ${testResponses.some(it => it.questionId === item) ? 'bg-green-400': 
                          seenQuestion.some(it => it === item) ? 'bg-yellow-400' : ''
                        } 
                        box-content size-5 rounded-lg p-4 mr-2 items-center bg-gray-200 hover:border-2 hover:border-gray-400`}
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