import React from 'react'
import { useState } from 'react'
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

const CreateListing = () => {
const VITE_API_URL = "/api";
  const {currentUser} = useSelector((state)=>state.user)
  const navigate = useNavigate();
const [FormData, setFormData] = useState({
  name : '',
  description : '',
  address : '',
  type : 'rent',
  bedrooms : 1,
  bathrooms : 1,
  regularPrice : 50,
  discountPrice :0,
  offer : false,
  parking : false,
  furnished : false,
});
const [erros, seterros] = useState(null)
const [imagePreviews, setImagePreviews] = useState([])
const [error, seterror] = useState(null)
const [loading, setloading] = useState(false)

const handleDeleteImage = (indexid) =>{
  const confirmed = window.confirm("Are you sure you want to delete this image?");
  
  if (!confirmed) {
    return; 
  }
  
  const filteredImage = imagePreviews.filter((item,index)=>{
      return index!== indexid
  })
  setImagePreviews(filteredImage);
  
  // Also update FormData
  setFormData(prev => ({
    ...prev,
    imageFiles: prev.imageFiles.filter((_, index) => index !== indexid)
  }));
}

const handleImageChange = (e) =>{
  const imagefiles = e.target.files;
  
  if (!imagefiles || imagefiles.length === 0) {
    seterros("Please select at least one image");
    return;
  }
  
  seterros(null);
  
  const filesArray = Array.from(imagefiles);
  const allBase64Images = [];
  

  filesArray.forEach((file, index) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64Image = reader.result;
      allBase64Images.push(base64Image);
      

      if (allBase64Images.length === filesArray.length) {
        setImagePreviews(prev => [...prev, ...allBase64Images]);
        setFormData(prev=>({
          ...prev, 
          imageFiles: [...(prev.imageFiles || []), ...allBase64Images]
        }));
        e.target.value = '';
      }
    };
    
    reader.onerror = () => {
      seterros("Failed to read image file");
    };
    
    reader.readAsDataURL(file);
  });
}


const handleChange = (e) =>{
  if (e.target.id === 'sale' || e.target.id === 'rent') {
    setFormData({
      ...FormData,
      type : e.target.id
    })
  }
  if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
    setFormData({
      ...FormData,
      [e.target.id] :e.target.checked
    })
  }
  if (e.target.id === 'number' || e.target.id === 'name' || e.target.id === 'textarea' || e.target.id === 'description' || e.target.id === 'address'|| e.target.id === 'bedrooms' || e.target.id === 'bathrooms' || e.target.id === 'regularPrice' || e.target.id === 'discountPrice') {
    setFormData({
      ...FormData,
      [e.target.id]  : e.target.value
    })
  }
}
console.log(FormData);


const handleSubmit = async  (e) =>{
  e.preventDefault();
try {

  if(FormData.imageFiles.length < 0){
    return seterror("You must Upload at least one Image")
  }
  if (+FormData.regularPrice < +FormData.discountPrice) {
    return seterror("Discount Price must be lower than te regular price")  
  }
    setloading(true)
  const response = await fetch(`${VITE_API_URL}/listing/create`,{
    method : "POST",
    credentials : "include",
    headers : {
      'Content-Type' : 'application/json'
    },

    body : JSON.stringify({
      ...FormData,
      userRef : currentUser._id
    })
  })
  const data = await response.json();
 if(data.success === false){
  seterror(data.message)
 }
  navigate(`/listing/${data._id}`)
  setloading(false)
} catch (error) {
  console.log(error);
  seterror("failed to create the listing")
}
}

  return (
   <main className='max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
    <form  onSubmit={handleSubmit} className='flex flex-col sm:flex-row'>
       <div className='flex flex-col gap-3 p-2 flex-1'>
        <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required  onChange={handleChange}
         value={FormData.name}
        />
        <textarea type="text" placeholder='description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} 
        value={FormData.description}/>
        <input type="text" placeholder='address' className='border p-3 rounded-lg' id='address' maxLength='62' minLength='10' required onChange={handleChange}  value={FormData.address}/>
        <div className='flex gap-2 flex-wrap'>
          <div className='flex gap-2'>
            <input type="checkbox" id='sale' className='w-5' onChange={handleChange}
            checked={FormData.type === 'sale'}/>
            <span className='font-semibold'>Sell</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='rent' className='w-5' onChange={handleChange}
            checked={FormData.type === 'rent'}/>
            <span className='font-semibold'>Rent</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='parking' className='w-5' onChange={handleChange}
            value={FormData.parking}/>
            <span className='font-semibold'>Parking Spot</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange}
             value={FormData.furnished}
            />
            <span className='font-semibold'>Furnished</span>
          </div>
          <div className='flex gap-2'>
            <input type="checkbox" id='offer' className='w-5' onChange={handleChange}
             value={FormData.offer}
            />
            <span className='font-semibold'>Offer</span>
          </div>
        </div>
        <div className='flex items-center flex-wrap gap-6'>
          <div className='flex items-center gap-2'>
            <input type="number"  id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} 
             value={FormData.bedrooms}
            />
            <p>Beds</p>
          </div>
          <div className='flex items-center gap-2'>
            <input type="number"  id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange}
             value={FormData.bathrooms}
            />
            <p>Baths</p>
          </div>
          <div className='flex items-center gap-2'>
            <input type="number"  id='regularPrice' min='50' max='1000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange}
             value={FormData.regularPrice}
            />
            <div>
            <p className='font-bold'>Regular Price</p>
            <span className='text-xs'>($ / month)</span>
            </div>
          </div>
{ FormData.offer  && <div className='flex items-center gap-2'>
            
            <input type="number"  id='discountPrice' min='0' max='1000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange}
             value={FormData.discountPrice}
            />
            <div>
            <p className='font-bold '>Discounted Price</p>
             <span className='text-xs'>($ / month)</span>
            </div>
          </div>
}
        </div>
       </div>
      <div className='flex flex-col flex-1'>
    <p className='font-semibold mb-3 ml-1'>
    Images:
    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover</span>
  </p>
  
  <div className='flex gap-2 p-1'>
    <input 
    onChange={handleImageChange}
      type="file" 
      id='images' 
      accept='image/*'  
      multiple  
      className=' ml-1 py-3 px-1 border w-[350px] border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition'
    />
  </div>
  {imagePreviews.length > 0 && (
    <div className="ml-1 mt-3">
      <p className="text-sm text-gray-600 mb-2">
        Selected images: {imagePreviews.length}
      </p>
      <div className="flex flex-wrap gap-2">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative">
            <img 
              src={preview} 
              alt={`Preview ${index + 1}`}
              className="w-20 h-20 object-cover rounded border"
            />
            <button  
              type='button' 
              className='bg-red-700 my-1 p-2 rounded text-xl text-white hover:bg-red-800'
              onClick={() => handleDeleteImage(index)}
            >
              Delete
            </button>
            {index === 0 && (
              <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-0.5">
                Cover
              </div>
            )}
            <div className="text-xs text-gray-500 text-center mt-1">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
  
  {error && (
    <p className="text-red-500 text-sm ml-1 mt-2">{error}</p>
  )}
  
<button className='bg-green-600 p-4 md:p-3 md:w-[350px] m-1 rounded-full font-bold text-white text-xl cursor-pointer disabled:opacity-80' disabled={loading}>{loading ? "Create Listing...." : "Create Listing"}</button>
</div>
    </form>
   </main>
  )
}

export default CreateListing;