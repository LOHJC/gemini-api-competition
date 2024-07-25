
import { useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function Settings({user, setUser, goal, setGoal}) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    setGoal(newValue);

  }
    return (
        <div className="h-full text-center bg-slate-950 text-white">
            <div className="font-bold text-3xl">Settings</div>
          <div className="font-semibold">{user.displayName}</div>
          <div className="font-semibold">{user.email}</div>
          <select className="dropdownContainer" value={goal} onChange={handleChange}>
            <option className="dropdownOption" value="stay healthy">Stay Healthy</option>
            <option className="dropdownOption"  value="weight loss">Weight Loss</option>
            <option className="dropdownOption"  value="gain muscle">Gain Muscle</option>
          </select>
        </div>
    );
}

export default Settings;