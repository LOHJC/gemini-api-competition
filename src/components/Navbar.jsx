
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Navbar({classFromOutside,user}) {
    const location = useLocation();
    const pathname = location.pathname;
    return (
        <div className={classFromOutside}>
            <nav className={` bg-slate-50 flex flex-col text-center`}>
                <img alt="profile-pic" className="rounded-full w-20 h-20 mx-auto my-2" src={user.photoURL}></img>
                <Link className={`link ${pathname === '/dashboard' ? `buttonActive` : `buttonNotActive`} m-2 rounded px-2 py-2`} to="/dashboard">Dashboard</Link>
                <Link className={`link ${pathname === '/settings' ? `buttonActive` : `buttonNotActive`} m-2 rounded px-2 py-2`} to="/settings">Settings</Link>
            </nav>
        </div>
    );
  }
  