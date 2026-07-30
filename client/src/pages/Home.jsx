import React from 'react'
import {Link} from "react-router-dom" 
import {useState,useEffect} from "react";
import {Swiper,SwiperSlide} from "swiper/react"
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules"
import 'swiper/css/bundle'
import 'swiper/css/navigation';
import ListingItem from "../components/ListingItem"

const Home = () => {


const VITE_API_URL = "/api";
  SwiperCore.use([Navigation]) // FIX: Use array
  const [offerlistings, setofferlistings] = useState([]);
  console.log(offerlistings);
  
  const [saleListing, setsaleListing] = useState([])
  const [rentlisting, setrentlisting] = useState([]);


useEffect(() => {
  const fetchOfferListings = async () =>{
    try {
      // FIX 1: Add 'await' here
      const res = await fetch(`${VITE_API_URL}/listing/get?offer=true&limit=4`);
      const data = await res.json();
      setofferlistings(data)
      await fetchRentListings();
    } catch (error) {
      console.log(error);
    }
  } 
  const fetchRentListings = async () =>{
    try {
      const res  = await fetch(`${VITE_API_URL}/listing/get?type=rent&limit=4`);
      const data = await res.json();
      setrentlisting(data)
      fetchSaleListings();
    } catch (error) {
      console.log(error);
    }
  }
  const fetchSaleListings = async () =>{
try {
  const res = await fetch(`${VITE_API_URL}/listing/get?type=sale&limit=4`);
  const data = await res.json();
  setsaleListing(data)
} catch (error) {
  console.log(error);
  
}
  }
  fetchOfferListings();
}, [])

  return (
    <div>
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700  font-bold text-3xl lg:text-6xl'>Find Your next <span className='text-slate-500'>perfect</span>
         <br />
         place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
           Etihad Estate is the best place your next perfect place to live
           <br />
          We have a wide range of properties for you to choose from 
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold  hover:underline'>Let's get started</Link>
      </div>
     
        {/* FIX: Add Swiper styles and key */}
        <Swiper navigation style={{height: '300px'}}>
          {offerlistings && offerlistings.length > 0 && 
            offerlistings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                 style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                >
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
         <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerlistings && offerlistings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerlistings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentlisting && rentlisting.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentlisting.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>

  )
}

export default Home