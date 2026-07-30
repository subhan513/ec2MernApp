import React from 'react';
import {Link,useNavigate} from "react-router-dom"
import { useState } from 'react';
import {useDispatch,useSelector} from "react-redux";
import {signInStart,signInSuccess,signInFailure} from "../redux/user/userSlice.js"
import OAuth from '../components/OAuth.jsx';
const SignIn = () => {

const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [formData, setformData] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {error,loading} = useSelector((state)=>state.user)
  const handleChange = (e) =>{
    setformData({...formData, [e.target.id] : e.target.value})
  }
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    dispatch(signInStart())
    const response = await fetch(`${VITE_API_URL}/api/auth/signin`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    
    const data = await response.json(); 
     
    if (data.success === true) { 
      dispatch(signInSuccess(data.user))
      navigate('/')
    } else {
      dispatch(signInFailure(data.message || "Sign in failed"))
    }
  } catch (error) {
    dispatch(signInFailure(error.message || "Something went wrong"))
  }
};
  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col md:w-xl item-center justify-center mx-auto container p-3 gap-3' onSubmit={handleSubmit}>
        <input type="email" placeholder='Enter your Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Enter your Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-gray-700 text-white p-3 rounded-xl hover:bg-green-400'>{loading ? "Loading..." :"SIGN IN"}</button>
        <OAuth/>
      </form>
      <div className="flex items-center justify-center">
              <p>Do Not have an account ? <Link to={'/sign-up'}>Sign Up </Link></p>
            </div>
      <div>
         {error && (
           <p className='text-red-700 flex justify-center'>
             {typeof error === 'string' ? error : error.message || "An error occurred"}
           </p>
         )}
      </div>
    </div>
  )
}

export default SignIn