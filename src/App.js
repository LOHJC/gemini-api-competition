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
import { getRecipe, getUserData, getGeneratedCount} from "./components/Database";

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

  //get the datas from server
  // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // const today = new Date();
  // const dayIndex = today.getDay();
  const [loading, setLoading] = useState(true);

  const [aiCount, setAICount] = useState(0);
  
  const getServerRecipe = async () => {
    let nextRecipes = [];
    for (let i=0; i<7; i++) {
      const [success,data] = await getRecipe(user.uid,i.toString());
      if (success)
        nextRecipes.push(data);
      else
        nextRecipes.push({})

    }
    setRecipes(nextRecipes);
  };

  const getServerSettings = async () => {
    const [success,data] = await getUserData(user.uid);
    
    if (success) {
      if (data.email == user.email) {
        setGoal(data.goal);
        setHeight(data.height);
        setWeight(data.weight);
      }
    }
  };

  const checkAIGeneratedCount = async () => {
    const [success,data] = await getGeneratedCount(user.uid);
    if (success) {
      setAICount(data.count);
    }
  };

  const getAllDataFromServer = async () => {
    try {
      // Run all async functions concurrently
      await Promise.all([
        getServerRecipe(),
        getServerSettings(),
        checkAIGeneratedCount()
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error("Error in one of the async functions: ", error);
    }
    
  }

  useEffect(()=>{
    if (user) {
      getAllDataFromServer();
    }
  },[user]);

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
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} goal={goal} height={height} weight={weight} recipes={recipes} setRecipes={setRecipes} generating={generating} setGenerating={setGenerating} aiCount={aiCount} setAICount={setAICount}/>} />
            <Route path="/recipes" element={<Recipes user={user} setUser={setUser} goal={goal} height={height} weight={weight} recipes={recipes} setRecipes={setRecipes} generating={generating} setGenerating={setGenerating} aiCount={aiCount} setAICount={setAICount}/>} />
            <Route path="/settings" element={<Settings user={user} setUser={setUser} goal={goal} setGoal={setGoal} height={height} setHeight={setHeight} weight={weight} setWeight={setWeight} loading={loading} setLoading={setLoading}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
