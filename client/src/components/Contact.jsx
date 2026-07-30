import React from 'react'
import { useEffect, useState } from 'react'
// Remove Link import since we don't need it
// import {Link} from "react-router-dom" 

const Contact = ({ listing }) => {

const VITE_API_URL = "/api";
  const [landloardData, setlandloardData] = useState(null)
  const [message, setmessage] = useState('') // Change from null to empty string

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/user/${listing.userRef}`)
        const data = await res.json();
        setlandloardData(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandLord()
  }, [listing.userRef])

  const onChange = (e) => {
    setmessage(e.target.value)
  }
  
  return (
    <>
      {landloardData && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landloardData.username}</span> {' '} for {' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>

          <textarea 
            name="message" 
            id="message" 
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here'
            className='w-full border p-3 rounded-lg'
          />

          {/* CHANGE HERE: Use <a> tag instead of <Link> */}
          <a
            href={`mailto:${landloardData.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </a>
        </div>
      )}
    </>
  )
}

export default Contact