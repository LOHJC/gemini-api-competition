
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useRef, useState } from "react";
import { model} from "../lib/geminiSetup";

function Dashboard({user, goal, height, weight, recipeOfTheDay, setRecipeOfTheDay}) {
    const buttonRef = useRef(null);

    const formatRecipe = (recipeData) => {
        if (recipeData == "") {
            return <div></div>
        }

        recipeData = JSON.parse(recipeData);
        return (
            <div className="m-2 border-solid border-2 border-slate-300  text-slate-50 rounded inline-block">
                <div className="text-xl font-bold bgGemini">Recipe of the day</div>
                <div className="text-xl font-bold ">{recipeData.recipe_title}
                    <span className="text-xs font-normal text-slate-300"> {recipeData.estimated_calories} calories</span>
                </div>
                <div>
                    <span className="text-center inline-block w-full text-slate-300 font-bold">Ingredients:</span>
                    <ul className="list-disc list-inside text-left inline-block mx-auto">
                    {recipeData.ingredients.map((ingredient,index) => (<li key={index}>{ingredient}</li>))}
                    </ul>
                </div>

                <div>
                    <span className="text-center inline-block w-full text-slate-300 font-bold">Preparation Steps:</span>
                    <ol className="list-decimal list-inside text-left inline-block w-96">
                    {recipeData.preparation_steps.map((step, index) => (<li key={index}>{step}</li>))}
                    </ol>
                </div>

                {/* <div>Day of Today:<br/>{recipeData.day_of_today}</div> */}
            </div>
        )

    }

    const generateRecipeOfTheDay = async () => {

        const button = buttonRef.current;
        button.disabled = true;
        button.textContent = 'Forming Recipe...';
        button.classList.add('cursor-not-allowed');
        //clear previous recipe
        setRecipeOfTheDay("");

        const prompt = `I am ${height}cm and ${weight}kg. My goal is to ${goal}, recommend the recipe for today. return data recipe_title in string, ingredients in string list, preparation_steps in string list, day_of_today and estimated_calories`;
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
        <div className="min-h-screen h-full text-center bg-slate-950 text-slate-50">
            <div className="mx-auto font-extrabold text-3xl textGemini inline">Dashboard</div>
            {/* <div>{user.displayName}'s goal: <span className="capitalize">{goal}</span></div> */}
            <div>{formatRecipe(recipeOfTheDay)}</div>
            <button ref={buttonRef} className="buttonActive w-40" onClick={generateRecipeOfTheDay}>Im feeling lucky</button>
        </div>
    );
}

export default Dashboard;