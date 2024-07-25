
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {app, auth, signInWithGoogle} from "../lib/firebaseSetup";

export default function Navbar({classFromOutside,user,setUser}) {

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
        <div className={classFromOutside}>
            <nav className={` bg-slate-50 flex flex-col text-center h-screen`}>
               <div className='m-2 border-solid border-2 border-slate-300 rounded'>
                  <img alt="profile-pic" className="rounded-full w-20 h-20 mx-auto my-2 border-dashed border-2 border-slate-300" src={user.photoURL}></img>
                  <button onClick={handleSignOut} className={"textGemini border-dashed border-2 border-slate-300 rounded-full hover:font-semibold w-20 h-10 my-2"}>Sign Out</button>
                </div>
                <Link className={`link ${pathname === '/dashboard' ? `buttonActive` : `buttonNotActive`}`} to="/dashboard">Dashboard</Link>
                <Link className={`link ${pathname === '/settings' ? `buttonActive` : `buttonNotActive`}`} to="/settings">Settings</Link>
            </nav>
        </div>
    );
  }
  