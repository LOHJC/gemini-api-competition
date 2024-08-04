
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {app, auth, signInWithGoogle} from "../lib/firebaseSetup";

export default function Navbar({user,setUser}) {

    const navigate = useNavigate()
  
    const handleSignOut = async () => {
      try {
        await signOut(auth).then(()=> {
            setUser(null);
            navigate("/");
            sessionStorage.clear();
        });
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };
    const location = useLocation();
    const pathname = location.pathname;
    return (
        <div className="flex-1">
            <nav className={` bg-slate-50 flex flex-row flex-wrap text-center justify-evenly sm:flex-col sm:justify-normal sm:min-h-screen sm:h-full`}>
               <div className='m-2 border-solid border-2 border-slate-300 rounded flex justify-center align-middle sm:flex-col'>
                  <img alt="profile-pic" className="rounded-full w-10 h-10 mx-2 my-2 border-dashed border-2 border-slate-300 sm:w-20 sm:h-20 sm:mx-auto" src={user.photoURL}></img>
                  <button onClick={handleSignOut} className={"textGemini border-dashed border-2 border-slate-300 rounded-full hover:font-semibold sm:w-20 sm:h-10 my-auto mx-2 py-2 px-2 sm:my-2 sm:mx-auto sm:p-0"}>Sign Out</button>
                </div>
                <Link className={`link ${pathname === '/dashboard' ? `buttonActive` : `buttonNotActive`} flex justify-center items-center`} to="/dashboard">Dashboard</Link>
                <Link className={`link ${pathname === '/recipes' ? `buttonActive` : `buttonNotActive`} flex justify-center items-center`} to="/recipes">Recipes</Link>
                <Link className={`link ${pathname === '/settings' ? `buttonActive` : `buttonNotActive`} flex justify-center items-center`} to="/settings">Settings</Link>
            </nav>
        </div>
    );
  }
  