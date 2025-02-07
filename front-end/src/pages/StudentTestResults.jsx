import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const StudentTestResults = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);


  useEffect(()=>{
    fetchData()
  },[id])
  
  console.log('student scores',scores)
  
  return (
    <div className='size-full flex justify-center'>
        
    </div>
  )
}

export default StudentTestResults