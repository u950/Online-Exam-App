import { createContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../components/Card";
import testImg from '/images/Group.png'
import TabComponent from "../../components/Stats";


const user = {
  name: 'user',  //admin email username
  email: 'user@example.com',
  imageUrl:
    'https://static.vecteezy.com/system/resources/thumbnails/005/005/788/small/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg',
}
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Tests', href: '#', current: false },
  { name: 'History', href: '#',  },
  { name: 'BookMarks', href: '#', current: false },
//   { name: 'Reports', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Sign out', href: '#', onClick:()=>{
    localStorage.removeItem('token');
    window.location.href = '/'
  } },
]

// export const CreateTestContext  = createContext()

const StudentDashBoard=()=> {
  
  const {id} = useParams();
  const location = useLocation();

  const {username} = location.state || {}
  // console.log('username ',username)

  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false)
  // load availble test on landing this page
  const [testCount, setTestCount] = useState(0);

  const [err, setError] = useState(null);

  // console.log('id',id)
  localStorage.removeItem('testStartTime')
  const [scores , setScores] = useState([]);
  // const [loading, setLoading] = useState(false);
  

  
  
  const fetchData = async() => {
    setLoading(true)
    try {  
      const response = await axios.get(`http://localhost:3000/user/student/getresults/${id}`)
      if (response.data && response.data.length > 0) {
        setScores(response.data)
        console.log('test scores fetched successfully')
      } else {
        console.log('No test attempts found')
        setScores([]) // Set empty array for no attempts
      }
    } catch(e) {
      console.log('Error fetching test attempts:', e.response?.data?.message || e.message)
      setError(e.response?.data?.message || 'Failed to fetch test attempts')
      setScores([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const fetchTest= async()=>{
    try{
      const response = await axios.get(`http://localhost:3000/user/test/${id}`)   // fetching test data using user id only 
      if(!response.data){
        console.log('test not availble', response.data.message)
        setError('test not available')
      }
      console.log('test fetched successfully')
      setTestData(response.data.data)
      // console.log(response)
      setTestCount(response.data.count)
    } catch(err){
      console.log('error recieving test', err)
      setError(err)
    } finally{
      setLoading(false)
    }
  }

  useEffect( ()=>{
    setLoading(true);
    fetchTest();
    fetchData();
    // setLoading(false);
  },[id])

  

  return (
    <>

      <div className="min-h-full">

        <Navbar 
          navigation={navigation}
          user={user}
          userNavigation={userNavigation}
          
        />
        {loading && 
          <div className="flex h-dvh w-dvw justify-center items-center">
            <h4 className="text-black font-serif">Loading...</h4>
          </div>
        }


        <main>
          <div className="mx-auto w-full size-full px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-200 to-lime-200">
            {username && <h2 className="text-2xl font-semibold "> Hello, {username}</h2>}
          <div className="flex justify-center">
            <h2 className="font-bold text-4xl" >Available Tests</h2>
          </div>
            <div className="grid grid-cols-4 gap-3 justify-center p-10 ">
              
              {testData.map((item)=>(
                <Card 
                  key={item._id}  // test id
                  image={testImg}
                  data={item}
                  studentId={id}
                  studentName={username}
                />
              ))}
            </div>
            <div className="flex flex-col p-10 mt-10">
              <div className="flex justify-center">
                <h1 className="font-extrabold p-4 text-5xl">Student Stats</h1>
              </div>
              { scores.length >0 && 
                <TabComponent scores={scores[1]}/>}
            </div>
              
          </div>
        </main>
      </div>

    </>
  )
}



export default StudentDashBoard