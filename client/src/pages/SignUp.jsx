import React from 'react';
import {Link,useNavigate} from "react-router-dom"
import { useState } from 'react';
import OAuth from '../components/OAuth';
const SignUp = () => {

const VITE_API_URL = "/api";
  const [formData, setformData] = useState({})
  const [error, seterror] = useState(null)
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) =>{
    setformData({...formData, [e.target.id] : e.target.value})
    console.log(formData)
  }
 // SignUp.jsx में आपका handleSubmit function कुछ ऐसा होगा:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setloading(true)
    const response = await fetch(`${VITE_API_URL}/auth/signup`, { // ← YAHI CHANGE KARO
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json(); 
  
    if (data.message === "User  Created Successfully") { 
      navigate('/sign-in')
    } else {
      throw new Error(data.message || "Signup failed");
    }
    
    setloading(false) 
    seterror(null)
  } catch (error) {
    seterror(error.message);
    setloading(false)
  }
};
  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col md:w-xl item-center justify-center mx-auto container p-3 gap-3' onSubmit={handleSubmit}>
        <input type="text" placeholder='Enter the username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='Enter your Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Enter your Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-gray-700 text-white p-3 rounded-xl hover:bg-green-400'>{loading ? "Loading..." :"SIGN UP"}</button>
        <OAuth/>
      </form>
      <div className="flex items-center justify-center">
        <p>Already have an account ? <Link to={'/sign-in'}>Sign in </Link></p>
      </div>
      <div>
         {error && <p className='text-red-700 flex justify-center'>{error}</p>}
      </div>
    </div>
  )
}

export default SignUp