import logo from './logo.svg';
import './App.css';

import { useState } from 'react';

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;
  });
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(`{"recipe_title": "Lemony Salmon with Roasted Asparagus", "ingredients": ["1 pound salmon fillet, skin on or off", "1 bunch asparagus, trimmed", "2 tablespoons olive oil", "1 lemon, cut into wedges", "1 tablespoon chopped fresh dill", "Salt and pepper to taste"], "preparation_steps": ["Preheat oven to 400 degrees F (200 degrees C).", "Place asparagus in a single layer on a baking sheet. Drizzle with olive oil and season with salt and pepper.", "Roast in preheated oven for 10-12 minutes, or until tender-crisp.", "While asparagus is roasting, season salmon with salt and pepper.", "Place salmon on a baking sheet lined with parchment paper. Drizzle with olive oil and top with lemon wedges and dill.", "Roast in preheated oven for 12-15 minutes, or until salmon is cooked through.", "Serve salmon with roasted asparagus and remaining lemon wedges."], "day_of_today": "Tuesday", "estimated_calories": "350"}`);

  
  const [goal, setGoal] = useState("stay healthy");
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(75);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home user={user} setUser={setUser}/>} />
        <Route path="/" element={<Home user={user} setUser={setUser}/>} />
        {/* <Route index element={<Home user={user} setUser={setUser}/>} />
        <Route path="dashboard" element={<Dashboard user={user}/>}/>
        <Route path="settings" element={<Settings user={user} setUser={setUser}/>} /> */}
        <Route path="/" element={<Layout user={user} setUser={setUser}/>}>
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} goal={goal} height={height} weight={weight} recipeOfTheDay={recipeOfTheDay} setRecipeOfTheDay={setRecipeOfTheDay}/>} />
          <Route path="/settings" element={<Settings user={user} setUser={setUser} goal={goal} setGoal={setGoal} height={height} setHeight={setHeight} weight={weight} setWeight={setWeight}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
