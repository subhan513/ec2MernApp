import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import { signInSuccess, signInFailure, deleteFailure,deleteSuccess,deleteStart,SignoutFailure,SignoutStart,SignoutSuccess} from "../redux/user/userSlice.js";
import { useRef, useState } from "react";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();

const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    password: '',
  });
  const [showError, setshowError] = useState(null)
  const [UserListings, setUserListings] = useState([])
  const [showUplaodListings, setshowUplaodListings] = useState(false)
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64Image = reader.result;
        setImageFile(base64Image);
        setFormData(prev => ({ ...prev, imagefile: base64Image }));
      };

      reader.onerror = () => {
        setError("Failed to read image file");
      };
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); 
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const id = currentUser._id;
      
      const updateData = { ...formData };
      if (!updateData.password.trim()) {
        delete updateData.password;
      }

      const ProfileApiResponse = await fetch(`${VITE_API_URL}/api/user/update/${id}`, {
        method: "POST",
        credentials : "include",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData)
      });

      const response = await ProfileApiResponse.json();

      if (!ProfileApiResponse.ok) {
        throw new Error(response.message || "Update failed");
      }

      if (response.success) {
        dispatch(signInSuccess(response.result));
        setSuccess(true);
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        throw new Error(response.message);
      }

    } catch (error) {
      console.error("Update error:", error);
      setError(error.message);
      dispatch(signInFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () =>{
    try {
      dispatch(deleteStart())
      const DeleteUserApiResponse = await fetch(`${VITE_API_URL}/api/user/delete/${currentUser._id}`,{
      method : "DELETE", 
      credentials : "include",
      headers : {
        "Content-Type" : "application/json"
      },
    })
    dispatch(deleteSuccess(DeleteUserApiResponse.message))
    } catch (error) {
      dispatch(deleteFailure(error.message))
    }

  }
  const handleSignOutClick = async () =>{
   try {
   dispatch(SignoutStart())
    const Response = await fetch(`${VITE_API_URL}/api/user/logout`)
     const data = await Response.json();
     if(data.success === false){
      dispatch(SignoutFailure(data.message))
      return;
     }
     dispatch(SignoutSuccess())
   } catch (error) {
      dispatch(SignoutFailure(error.message))
   }
  }



  const handleShowListings = async () =>{
    try {
    setshowUplaodListings(true)
   setshowError(null)
      const response  = await fetch(`${VITE_API_URL}/api/user/listings/${currentUser._id}`,{
        credentials : "include"
      })
      const data = await response.json();
    if(data.message === false){
    setshowError(data.message)
    }
    setUserListings(data)
    setshowUplaodListings(false)
    
    } catch (error) {
     setshowError(error.message)
    }
  }
  console.log(UserListings);

  const handleDeleteListing = async (listingID) =>{
try {
  const response = await fetch(`${VITE_API_URL}/api/listing/listings/${listingID}`,{
    method : "DELETE",
    credentials : "include"
  })
  const data  = await response.json();
  if(data.message === false){
    return;
  }
  setUserListings(prev=>
    prev.filter((listing)=>listing._id !== listingID)
  )
} catch (error) {
  console.log(error);
}
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-4">Profile</h1>
    
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form className="flex flex-col my-7" onSubmit={handleUpdateProfile}>
        <input 
          onChange={handleImageUpload} 
          type="file" 
          ref={fileRef} 
          className="hidden" 
          accept="image/*"
        />

        <div className="relative self-center mb-4">
          <img 
            onClick={() => fileRef.current.click()} 
            src={imageFile || currentUser.avatar} 
            className="h-24 w-24 rounded-full cursor-pointer border-2 border-gray-300 hover:border-gray-500"
            alt="Profile" 
          />
          <div className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-1 text-xs cursor-pointer">
            Edit
          </div>
        </div>
        <input 
          type="text" 
          id="username" 
          placeholder="Username" 
          value={currentUser.username}
          className='p-3 border rounded my-2' 
          onChange={handleChange}
          required
        />

        <input 
          type="email" 
          id="email" 
          placeholder="Email" 
          value={currentUser.email}
          className='p-3 border rounded my-2' 
          onChange={handleChange}
          required
        />
        <input 
          type="password" 
          id="password" 
          placeholder="New Password (leave empty to keep current)" 
          value={currentUser.password}
          className='p-3 border rounded my-2' 
          onChange={handleChange}
        />
        <button 
          type="submit" 
          className="bg-gray-900 text-white p-3 rounded hover:bg-gray-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
         <button>
          <Link className="bg-green-700 p-3 flex items-center justify-center my-1 text-white rounded-lg font-semibold text-xl" to={'/create-listing'}>Create Listing</Link>
          </button>
      </form>
      <div className="flex justify-between font-normal mt-6 pt-6 border-t">
        <button className="text-red-600 hover:text-red-800 font-bold cursor-pointer" onClick={handleDeleteUser}>
          Delete Account
        </button>
        <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={handleSignOutClick}>
          Sign Out
        </button>
      </div>
     <div className="flex items-center justify-center">
      <button className="bg-blue-700 text-white text-lg rounded
      w-fit p-3 hover:bg-green-700 cursor-pointer" onClick={handleShowListings}>Show Listings</button>
     </div>
     <p className='text-red-700 mt-5'>
        {showError ? 'Error showing listings' : ''}
      </p>
    {UserListings && UserListings.length > 0 && (
      <div>
        <h1 className="text-red-800 text-xl font-semibold">Your Listings</h1>
        {UserListings.map((listing)=>{
           return <div
           key={listing._id}
           className="flex justify-between items-center gap-2"
          >
            <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing Cover"  
             className="h-18 w-18 object-contain text-center"
            /></Link>
            <Link className="line-clamp-4" to={`/listing/${listing._id}`}>{listing.name}</Link>
            <div className="flex flex-col">
              <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 font-bold">EDIT</button>
              </Link>
              <Link>
              <button className="text-red-700 font-bold" onClick={()=>handleDeleteListing(listing._id)}>DELETE</button>
              </Link>

            </div>
          </div>
        })}
      </div>
    )}
    </div>
  );
}

export default Profile;