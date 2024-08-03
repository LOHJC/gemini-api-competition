import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Recipes from './pages/Recipes';
import { CookiesProvider, useCookies } from 'react-cookie';
import { getRecipe, getUserData, getGeneratedCount, addAndUpdateUserData, addAndUpdateRecipe} from "./components/Database";

function App() {
  const HEIGHT = 178;
  const WEIGHT = 75;
  const GOAL = "stay healthy";

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;
  });
  const [recipes, setRecipes] = useState([]);
  
  //user data
  const [goal, setGoal] = useState(GOAL);
  const [height, setHeight] = useState(HEIGHT);
  const [weight, setWeight] = useState(WEIGHT);

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
      else {
        nextRecipes.push({})
        await addAndUpdateRecipe(user.uid,i.toString(),{});
      }

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
    else { //no such user data
      await addAndUpdateUserData(user.uid, user.email, user.displayName, parseFloat(height), parseFloat(weight), goal);
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
    else { //no user, restore all value to default
      setLoading(true);
      setGoal(GOAL);
      setHeight(HEIGHT);
      setWeight(WEIGHT);
      setRecipes([]);
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
          <Route path="/" element={<Layout user={user} setUser={setUser} loading={loading}/>}>
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} goal={goal} height={height} weight={weight} recipes={recipes} setRecipes={setRecipes} generating={generating} setGenerating={setGenerating} aiCount={aiCount} setAICount={setAICount} />} />
            <Route path="/recipes" element={<Recipes user={user} setUser={setUser} goal={goal} height={height} weight={weight} recipes={recipes} setRecipes={setRecipes} generating={generating} setGenerating={setGenerating} aiCount={aiCount} setAICount={setAICount}/>} />
            <Route path="/settings" element={<Settings user={user} setUser={setUser} goal={goal} setGoal={setGoal} height={height} setHeight={setHeight} weight={weight} setWeight={setWeight}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
