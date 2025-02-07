import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const TestInstruction = () => {

    const location = useLocation()
    const {data, userId, studentName} = location.state || {};

    // const {id} = useParams;

    const navigate = useNavigate()
    const [checked , setChecked]= useState(false)
    const handleCheckbox =(e)=>{
        setChecked(e.target.checked)
    }

    const handleClick =()=> {
        navigate(`/student/testpage/${data._id}/`, {state:{data: data, userId: userId, studentName: studentName}})  // sending userId to test page 
    }
  return (
    <div className='flex flex-col h-dvh w-full'>    
      <div className="flex justify-center h-16 bg-gray-700 items-center">
        <h1 className='font-bold text-xl text-white'>{data.title}</h1>
      </div>

      <div className='flex flex-col justify-center items-center'>
            <h1 className='text-xl font-bold font-mono'>Here are Some general instruction for taking 
                an MCQ test
            </h1>
            <p className='p-6'>
            The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.
The Questions Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
 You have not visited the question yet.
 You have not answered the question.
 You have answered the question.
 You have NOT answered the question, but have marked the question for review.
 The question's "Answered and Marked for Review" will be considered for evaluation.
You can click on the {'<'} arrow which appears to the left of question palette to collapse the question palette thereby maximizing the question window. To view the question palette again, you can click on {"<"} which appears on the right side of question window.
You can click on your "Profile" image on top right corner of your screen to change the language during the exam for entire question paper. On clicking of Profile image you will get a drop-down to change the question content to the desired language.
You can click on  to navigate to the bottom and  to navigate to top of the question are, without scrolling.
Navigating to a Question:
To answer a question, do the following:
Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.
Click on Save &amp; Next to save your answer for the current question and then go to the next question.<br />
Click on Mark for Next to save your answer for the current question, mark it for review, and then go to the next.<br />
Answering a Question:<br />
Procedure for answering a multiple choice type question:
To select you answer, click on the button of one of the options.
To deselect your chosen answer, click on the button of the chosen option again or click on the Clear Response button
To change your chosen answer, click on the button of another option
To save your answer, you MUST click on the Save & Next button.
To mark the question for review, click on the Mark for Review & Next button.
To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.
Navigating through sections:
Sections in this question paper are displayed on the top bar of the screen. Questions in a section can be viewed by click on the section name. The section you are currently viewing is highlighted.
After click the Save & Next button on the last question for a section, you will automatically be taken to the first question of the next section.
You can shuffle between sections and questions anything during the examination as per your convenience only during the time stipulated.
Candidate can view the corresponding section summery as part of the legend that appears in every section above the question palette.
Please note all questions will appear in your default language. This language can be changed for a particular question later on.  

      I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / 
      not carrying any prohibited gadget like mobile phone, Bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the
       instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations
            </p>

            <div className='flex flex-row justify-between gap-6'>
                <div className=''>
                    <input type="checkbox" id='box' value='check' checked={checked} onChange={handleCheckbox}/>
                </div>
                I agree
                <div>
                <button
                    className='btn-primary'
                    onClick={handleClick}
                >Proceed</button>
                </div>
            </div>
       </div>
    </div>
  )
}

export default TestInstruction
