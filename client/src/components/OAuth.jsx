import {getAuth, GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import {useDispatch} from "react-redux";
import {signInSuccess} from "../redux/user/userSlice.js"
import {useNavigate} from "react-router-dom"
import { app } from "../firebase";
const OAuth = () => {

const VITE_API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      console.log('Firebase Auth Success:', result.user);

      const res = await fetch(`${VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      });

      console.log('Backend Response Status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Backend request failed');
      }

      const data = await res.json();
      console.log('Backend Data:', data);
      
      dispatch(signInSuccess(data.user));
      navigate('/')
    } catch (error) {
      console.log("Could not sign in with Google:", error.message);
      alert(`Sign in failed: ${error.message}`);
    }
  };

  return (
    <button 
      onClick={handleGoogleClick} 
      type='button' 
      className='text-center bg-red-700 text-white uppercase p-3 cursor-pointer rounded font-semibold hover:bg-red-800 transition'
    >
      Sign in with Google
    </button>
  );
};

export default OAuth