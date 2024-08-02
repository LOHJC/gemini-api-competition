
import { useEffect, useRef, useState } from "react";
import { addAndUpdateUserData } from "../components/Database";

function Settings({user, setUser, goal, setGoal, height, setHeight, weight, setWeight, loading, setLoading}) {
  const [localGoal, setLocalGoal] = useState("stay healthy");
  const [localHeight, setLocalHeight] = useState(175);
  const [localWeight, setLocalWeight] = useState(75);

  const heightEdit = useRef(null);
  const weightEdit = useRef(null);
  const goalSelect = useRef(null);

  //const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLocalGoal(goal);
  },[goal]);
  
  useEffect(()=>{
    setLocalHeight(height);
  },[height]);
  
  useEffect(()=>{
    setLocalWeight(weight);
  },[weight]);

  const verifyInputNumber = (value) => {
    if((value === '' || !isNaN(value)) && !isNaN(parseFloat(value))) {
      return true;
    }
    else {
      return false;
    }
  }

  const saveSettings = () => {
    let allIsVerified = true;
    setGoal(localGoal);
    goalSelect.current.classList.add("outline-green-500");
    if (verifyInputNumber(localHeight)){
      setHeight(localHeight);
      heightEdit.current.classList.add("outline-green-500");
      heightEdit.current.classList.remove("outline-red-500");
    }
    else {
      allIsVerified = false;
      heightEdit.current.classList.add("outline-red-500");
      heightEdit.current.classList.remove("outline-green-500");
    }
    if (verifyInputNumber(localWeight)){
      setWeight(localWeight);
      weightEdit.current.classList.add("outline-green-500");
      weightEdit.current.classList.remove("outline-red-500");
    }
    else {
      allIsVerified = false;
      weightEdit.current.classList.add("outline-red-500");
      weightEdit.current.classList.remove("outline-green-500");
    }

    if (allIsVerified) {
      addAndUpdateUserData(user.uid, user.email, user.displayName, parseFloat(localHeight), parseFloat(localWeight), localGoal);
    }
  }

  const clearOutline = () => {
    heightEdit.current.classList.remove("outline-green-500","outline-red-500");
    weightEdit.current.classList.remove("outline-green-500","outline-red-500");
    goalSelect.current.classList.remove("outline-green-500","outline-red-500");
  }

  return (
      <div className="min-h-screen h-full text-center bg-slate-950 text-slate-50">
          <div className="font-extrabold text-3xl textGemini inline">Settings</div>
        <div className="font-semibold">{user.displayName}</div>
        <div className="font-semibold">{user.email}</div>
        {!loading?
          <>
          <div className="relative m-3 flex items-center text-slate-950 w-52 mx-auto">
            <span className="absolute left-3">cm</span>
            <input className="text-left rounded w-full pl-12 py-2 outline outline-offset-2" onSelect={clearOutline} ref={heightEdit} placeholder="Height (cm)" value={localHeight} onChange={(event)=>{setLocalHeight(event.target.value)}}></input>
          </div>
          <div className="relative m-3 flex items-center text-slate-950 w-52 mx-auto">
            <span className="absolute left-3">kg</span>
            <input className="text-left rounded w-full pl-12 py-2 outline outline-offset-2" onSelect={clearOutline} ref={weightEdit} placeholder="Weight (kg)" value={localWeight} onChange={(event)=>{setLocalWeight(event.target.value)}}></input>
          </div>
          <div>
            <select className="dropdownContainer outline outline-offset-2" ref={goalSelect} value={localGoal} onClick={clearOutline} onChange={(event)=>{setLocalGoal(event.target.value)}}>
              <option className="dropdownOption" value="stay healthy">Stay Healthy</option>
              <option className="dropdownOption" value="weight loss">Weight Loss</option>
              <option className="dropdownOption" value="gain muscle">Gain Muscle</option>
            </select>
          </div>
          <button className="buttonActive w-20" onClick={saveSettings}>Save</button>
          </>:<div></div>}
        
      </div>
  );
}

export default Settings;