
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import { useEffect, useState } from "react";

export default function Layout({ user,setUser }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(()=> {
        if (!user) {
            navigate("/");
        }
        else {
            setIsLoaded(true);
        }
    },[navigate]);

    if(isLoaded)
    {
        return (
            <div className="flex flex-row h-screen">
                <Navbar classFromOutside={"flex-1"} user={user} setUser={setUser}>
                </Navbar>
                <div className="w-full"><Outlet /></div>
            </div>
        )
    }
    else {
        return <div></div>;
    }
  }