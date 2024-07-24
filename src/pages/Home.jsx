
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

import {app, auth, signInWithGoogle} from "../lib/firebaseSetup";
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';


function Home({user,setUser}) {
  
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
      if (user)
        navigate("/dashboard");
  },[user]);

  //set the user here
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle(setUser);
      if (user)
        navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center bg-slate-950">
      <div className={`mx-auto text-white text-center font-bold text-5xl textGemini`}>Diet.ai</div>
      <p className="text-white text-center font-semibold text-3xl">Plan your diet with <span className="textGemini">Gemini</span> AI</p>
      <button onClick={handleSignIn} className={`mx-auto my-2 text-white font-semibold py-1 px-2 rounded bgGemini hover:from-gemini-end hover:to-gemini-start`}><FontAwesomeIcon icon={faGoogle}/> Sign in with Google
      </button>
      <button className='text-white text-center' onClick={()=>{
        navigate("/dashboard");
      }}>Go To Dashboard</button>
    </div>
  );
}

export default Home;