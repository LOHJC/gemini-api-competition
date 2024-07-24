import logo from './logo.svg';
import './App.css';

import { useState } from 'react';

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home user={user} setUser={setUser}/>} />
        <Route path="/" element={<Home user={user} setUser={setUser}/>} />
        {/* <Route index element={<Home user={user} setUser={setUser}/>} />
        <Route path="dashboard" element={<Dashboard user={user}/>}/>
        <Route path="settings" element={<Settings user={user} setUser={setUser}/>} /> */}
        <Route path="/" element={<Layout user={user}/>}>
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>} />
          <Route path="/settings" element={<Settings user={user} setUser={setUser}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
