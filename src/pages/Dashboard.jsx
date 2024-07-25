
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useRef, useState } from "react";
import { model} from "../lib/geminiSetup";

function Dashboard({user, goal}) {
    const [recipeOfTheDay, setRecipeOfTheDay] = useState("");
    const buttonRef = useRef(null);

    const formatRecipe = (recipeData) => {
        return `
        Recipe Title: ${recipeData.recipe_title}

        Ingredients:
        ${recipeData.ingredients.map(ingredient => `- ${ingredient}`).join('\n')}

        Preparation Steps:
        ${recipeData.preparation_steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

        Day of Today: ${recipeData.day_of_today}
        Estimated Calories: ${recipeData.estimated_calories}
        `;

    }

    const generateRecipeOfTheDay = async () => {

        const button = buttonRef.current;
        button.disabled = true;
        button.textContent = 'Forming Recipe...';
        button.classList.add('cursor-not-allowed');
        //clear previous recipe
        setRecipeOfTheDay("");

        const prompt = `My final goal is to ${goal}, recommend the recipe for today. return data recipe_title in string, ingredients in string list, preparation_steps in string list, day_of_today and estimated_calories`;
        // console.log(prompt);

        const result = await model.generateContent(prompt);
        //console.log(result); //for json mode
        const recipeResponse = result.response.candidates[0].content.parts[0].text;

        const recipeData = JSON.parse(recipeResponse);

        // Step 3: Format and display the extracted information
        //const formattedOutput = formatRecipe(recipeData);
        setRecipeOfTheDay(recipeResponse);
        button.disabled = false;
        button.textContent = 'Im feeling lucky';
        button.classList.remove('cursor-not-allowed');
    }

    return (
        <div className="h-full text-center bg-slate-950 text-white">
            <div className="font-bold text-3xl">Dashboard</div>
            <div>{user.displayName}'s goal: <span className="capitalize">{goal}</span></div>
            <button ref={buttonRef} className="buttonActive w-40" onClick={generateRecipeOfTheDay}>Im feeling lucky</button>
            <div>Recipe of the day</div>
            <div>{recipeOfTheDay}</div>
        </div>
    );
}

export default Dashboard;