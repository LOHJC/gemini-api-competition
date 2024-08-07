
import { useEffect, useRef } from "react";
import { model} from "../lib/geminiSetup";
import { addAndUpdateRecipe, getGeneratedCount, decreaseGeneratedCount } from "../components/Database";

function Recipes({user, goal, height, weight, recipes, setRecipes, generating, setGenerating, aiCount, setAICount}) {
    const buttonRef = useRef(null);

    useEffect(()=> {
        const button = buttonRef.current;
        if (button) {
            if (generating) {                
                button.disabled = true;
                button.textContent = `Forming recipes (${aiCount})`;
                button.classList.add('cursor-not-allowed');
            }
            else {
                button.disabled = false;
                button.textContent = `New recipes (${aiCount})`;
                button.classList.remove('cursor-not-allowed');
            }

            if (aiCount <= 0) {                
                button.classList.add('cursor-not-allowed');
            }
        }
    },[generating,aiCount]);

    
    const addRecipes = async (recipe, index) => {
        await addAndUpdateRecipe(user.uid,index.toString(),recipe);
    }

    const formatRecipes = (recipesArray) => {
        // console.log(recipesArray)
        if (recipesArray.length === 0) {
            return <div></div>
        }
        // console.log(recipesArray);
        // recipesArray.map((recipeJson,index)=>{
        //     console.log(index,":",recipeJson)
        // })
        
        return (
            <div className="flex flex-row flex-wrap justify-evenly">
                {recipesArray.map((recipeJson,index)=>{
                    // console.log(index,recipeJson);
                    let recipe_name = ""
                    let calories = ""
                    let ingredients=  []
                    let steps = []
                    let day = ""
                    
                    if (Object.keys(recipeJson).length > 0) {
                        if ("recipe_title" in recipeJson) {
                            recipe_name = recipeJson.recipe_title;
                        }
                        if ("estimated_calories" in recipeJson) {
                            calories = recipeJson.estimated_calories;
                        }
                        if ("ingredients" in recipeJson) {
                            ingredients = recipeJson.ingredients;
                        }
                        if ("preparation_steps" in recipeJson) {
                            steps = recipeJson.preparation_steps;
                        }
                        if ("day_of_today" in recipeJson) {
                            day = recipeJson.day_of_today;
                        }
                    }

                    return (<div key={index} className="mx-0.5 my-2 border-solid border-2 border-slate-300 text-slate-50 rounded flex flex-col items-center w-10/12 sm:w-5/12 xl:w-96">
                        <div className="text-xl font-bold bg-slate-50 text-slate-950 w-full">Recipe for <span className="textGemini">{day}</span></div>
                        <div className="text-xl font-bold px-2">{recipe_name}
                            <span className="text-xs font-normal text-slate-300"> {calories} calories</span>
                        </div>
                        <div className="m-3">
                            <div className="text-center w-full text-slate-300 font-bold">Ingredients:</div>
                            <div>
                                <ul className="list-disc list-inside text-left">
                                {ingredients.map((ingredient,index) => (<li key={index}>{ingredient}</li>))}
                                </ul>
                            </div>
                        </div>
    
                        <div className="m-3">
                            <div className="text-center w-full text-slate-300 font-bold">Preparation Steps:</div>
                            <div className="mx-auto">
                                <ol className="list-decimal list-inside text-left">
                                {steps.map((step, index) => (<li key={index}>{step}</li>))}
                                </ol>
                            </div>
                            
                        </div>
                    </div>)
                })}
            </div>
            
        )

    }

    const generateRecipes = async () => {
        //check the current AI generated count
        if (aiCount <= 0) {
            return;
        }
        else {
            decreaseGeneratedCount(user.uid);
            setAICount(aiCount-1);
        }

        //clear previous recipe
        setRecipes([]);

        const prompt = `I am ${height}cm and ${weight}kg. My goal is to ${goal}, recommend the recipe for a week. return under recipes, the  recipe_title in string, ingredients in string list, preparation_steps in string list, day_of_today and estimated_calories, in the sequence from Sunday to Saturday.`;
        // console.log(prompt);
        setGenerating(true);
        const result = await model.generateContent(prompt);
        const recipeResponse = result.response.candidates[0].content.parts[0].text;
        setGenerating(false);

        // Step 3: Format and display the extracted information
        const recipeJson = JSON.parse(recipeResponse);
        const recipeArray = recipeJson.recipes;
        
        recipeArray.map((recipe,index)=>{
            addRecipes(recipe,index);
            return 1;
        });

        //console.log("recipeArray:",recipeArray)
        setRecipes(recipeArray);
    }

    return (
        <div className="min-h-screen h-full text-center bg-slate-950 text-slate-50">
            <div className="mx-auto font-extrabold text-3xl textGemini inline">Recipes</div>
            {/* <div>{user.displayName}'s goal: <span className="capitalize">{goal}</span></div> */}
            <div>{formatRecipes(recipes)}</div>
            <button ref={buttonRef} className="buttonActive w-40" onClick={generateRecipes}>New recipes</button>
        </div>
    );
}

export default Recipes;