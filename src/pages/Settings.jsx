
import Layout from "../components/Layout";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {app, auth, signInWithGoogle} from "../lib/firebaseSetup";
import { useNavigate } from "react-router-dom";

function Settings({user,setUser}) {

  const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
          await signOut(auth);
          setUser(null);
          navigate("/");
        } catch (error) {
          console.error("Error signing out:", error);
        }
      };

    return (
        // <Layout user={user}>
        //     <h5 className="h-full text-center bg-slate-950 text-white">
        //     {/* <div>user.name</div> */}
        //     <button onClick={handleSignOut} className={`buttonActive rounded hover:font-bold w-20`}>Sign Out</button>
        //     </h5>
        // </Layout>

        
        <h5 className="h-full text-center bg-slate-950 text-white">
          <div className="font-semibold">{user.displayName}</div>
          <div className="font-semibold">{user.email}</div>
          <button onClick={handleSignOut} className={`buttonActive rounded hover:font-bold w-20`}>Sign Out</button>
        </h5>
    );
}

export default Settings;