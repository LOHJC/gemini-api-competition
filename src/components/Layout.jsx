
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function Layout({ user,setUser,loading}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(()=> {
        if (!user) {
            navigate("/");
        }
        else {
            setIsLoaded(true);
        }
    },[]);

    if(isLoaded)
    {
        return (
            <div className="flex flex-col h-auto sm:flex-row sm:min-h-screen sm:h-full">
                {loading?<div className="bg-slate-950 h-screen w-screen text-slate-50 flex justify-center align-middle items-center"><Spinner></Spinner></div>:<><Navbar user={user} setUser={setUser}>
                </Navbar>
                <div className="w-full"><Outlet /></div></>}
            </div>
            
        )
    }
    else {
        return <div></div>;
    }
  }