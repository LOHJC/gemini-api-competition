import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Recipes from './pages/Recipes';
import { CookiesProvider, useCookies } from 'react-cookie';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;
  });
  const [recipes, setRecipes] = useState([]);
  
  //user data
  const [goal, setGoal] = useState("stay healthy");
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(75);

  const [generating, setGenerating] = useState(false);

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home user={user} setUser={setUser}/>} />
          <Route path="/" element={<Home user={user} setUser={setUser}/>} />
          {/* <Route index element={<Home user={user} setUser={setUser}/>} />
          <Route path="dashboard" element={<Dashboard user={user}/>}/>
          <Route path="settings" element={<Settings user={user} setUser={setUser}/>} /> */}
          <Route path="/" element={<Layout user={user} setUser={setUser}/>}>
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} goal={goal} height={height} weight={weight} recipes={recipes} setRecipes={setRecipes} generating={generating} setGenerating={setGenerating}/>} />
            <Route path="/recipes" element={<Recipes user={user} setUser={setUser} goal={goal} height={height} weight={weight} recipes={recipes} setRecipes={setRecipes} generating={generating} setGenerating={setGenerating}/>} />
            <Route path="/settings" element={<Settings user={user} setUser={setUser} goal={goal} setGoal={setGoal} height={height} setHeight={setHeight} weight={weight} setWeight={setWeight}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
