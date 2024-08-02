
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useRef, useState } from "react";
import { model} from "../lib/geminiSetup";
import { addAndUpdateRecipe, getGeneratedCount, decreaseGeneratedCount } from "../components/Database";

function Dashboard({user, goal, height, weight, recipes, setRecipes, generating, setGenerating, aiCount, setAICount}) {
    const buttonRef = useRef(null);
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dayIndex = today.getDay();

    useEffect(()=> {
        const button = buttonRef.current;
        if (button) {
            if (generating) {                
                button.disabled = true;
                button.textContent = `Forming recipe (${aiCount})`;
                button.classList.add('cursor-not-allowed');
            }
            else {

                button.disabled = false;
                button.textContent = `Im feeling lucky (${aiCount})`;
                button.classList.remove('cursor-not-allowed');
            }

            if (aiCount <= 0) {        
                button.disabled = true;            
                button.classList.add('cursor-not-allowed');
            }
        }
    },[generating,aiCount]);

    const formatRecipe = (recipeJson) => {
        if (Object.keys(recipeJson).length === 0) {
            return <div></div>
        }
        return (
            <div className="mx-auto m-2 border-solid border-2 border-slate-300  text-slate-50 rounded flex justify-center flex-col items-center w-10/12 min-w-min">
                <div className="text-xl font-bold bgGemini w-full">Recipe of the day</div>
                <div className="text-xl font-bold ">{recipeJson.recipe_title}
                    <span className="text-xs font-normal text-slate-300"> {recipeJson.estimated_calories} calories</span>
                </div>
                <div className="m-3">
                    <div className="text-center w-full text-slate-300 font-bold">Ingredients:</div>
                    <div>
                        <ul className="list-disc list-inside text-left">
                        {recipeJson.ingredients.map((ingredient,index) => (<li key={index}>{ingredient}</li>))}
                        </ul>
                    </div>
                </div>

                <div className="m-3">
                    <div className="text-center w-full text-slate-300 font-bold">Preparation Steps:</div>
                    <div className="mx-auto">
                        <ol className="list-decimal list-inside text-left">
                        {recipeJson.preparation_steps.map((step, index) => (<li key={index}>{step}</li>))}
                        </ol>
                    </div>
                    
                </div>

                {/* <div>Day of Today:<br/>{recipeJson.day_of_today}</div> */}
            </div>
        )

    }

    const generateRecipeOfTheDay = async () => {
        //check the current AI generated count
        if (aiCount <= 0) {
            return;
        }
        else {
            decreaseGeneratedCount(user.uid);
            setAICount(aiCount-1);
        }

        //clear previous recipe
        let nextRecipes = []
        if (recipes.length) {
            nextRecipes = recipes.map((recipe, index) => {
            if (index === dayIndex) {
                return {};
            } else {
                return recipe;
            }
            });
        }
        setRecipes(nextRecipes);

        const prompt = `I am ${height}cm and ${weight}kg. My goal is to ${goal}, recommend the recipe for ${days[dayIndex]}. return data recipe_title in string, ingredients in string list, preparation_steps in string list, day_of_today and estimated_calories`;
        // console.log(prompt);

        setGenerating(true);
        const result = await model.generateContent(prompt);
        const recipeResponse = result.response.candidates[0].content.parts[0].text;
        setGenerating(false);

        // Step 3: Format and display the extracted information
        const recipeJson = JSON.parse(recipeResponse);
        if (recipes.length != 0 && Object.keys(recipeJson).length != 0) {
            nextRecipes = recipes.map((recipe, index) => {
            if (index === dayIndex) {
                return recipeJson;
            } else {
                return recipe;
            }
            });
        }
        else if(Object.keys(recipeJson).length > 0){
            if (recipes.length == 0) {
                //recipes list are empty
                nextRecipes = []
                for (let i=0; i<7; i++) {
                    if (i==dayIndex) {
                        await addAndUpdateRecipe(user.uid,i.toString(),recipeJson);
                        nextRecipes.push(recipeJson)
                    }
                    else {
                        nextRecipes.push({});
                    }
                }
            }
        }
        setRecipes(nextRecipes);
    }

    return (
        <div className="min-h-screen h-full text-center bg-slate-950 text-slate-50">
            <div className="mx-auto font-extrabold text-3xl textGemini inline">Dashboard</div>
            {/* <div>{user.displayName}'s goal: <span className="capitalize">{goal}</span></div> */}
            <div>{recipes.length>0?formatRecipe(recipes[dayIndex]):""}</div>
            <button ref={buttonRef} className="buttonActive w-40" onClick={generateRecipeOfTheDay}>Im feeling lucky</button>
        </div>
    );
}

export default Dashboard;