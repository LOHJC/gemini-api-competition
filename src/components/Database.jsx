
import { firestore } from "../lib/firebaseSetup"
import { doc, setDoc, getDoc, serverTimestamp, collection, increment, updateDoc } from "firebase/firestore"; 


async function addAndUpdateUserData(uid, email, name, height, weight, goal) {
    try {
        await setDoc(doc(firestore, "users", uid), {
          email: email,
          name: name,
          height: height,
          weight: weight,
          goal: goal,          
          modifiedAt: serverTimestamp()
        }).then(()=> {
            console.log("User data successfully written!");
        })
    }
    catch (e) {
        console.error("Error adding user data: ", e);
    }
}

async function getUserData(uid) {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("User data:", docSnap.data());
        return [true,docSnap.data()];
    } 
    else {
        // docSnap.data() will be undefined in this case
        console.log("No such user!");
        return [false,""];
    }
}

async function addAndUpdateRecipe(uid, index, recipe) {
    try {
        const userDocRef = doc(firestore, "recipes", uid); //document with ID=uid, in "recipes" collection
        const recipesCollectionRef = collection(userDocRef, "userRecipes"); //under it, has "userRecipes"
        const recipeDocRef = doc(recipesCollectionRef, index); //inder it, has document with ID=index
        await setDoc(recipeDocRef, recipe).then(()=> {
            console.log("Recipe data successfully written!");
        });
    }
    catch (e) {
        console.error("Error adding recipe: ", e);
    }
}

async function getRecipe(uid, index) {
    const userDocRef = doc(firestore, "recipes", uid); //document with ID=uid, in "recipes" collection
    const recipesCollectionRef = collection(userDocRef, "userRecipes"); //under it, has "userRecipes"
    const recipeDocRef = doc(recipesCollectionRef, index); //inder it, has document with ID=index
    const docSnap = await getDoc(recipeDocRef);
    if (docSnap.exists()) {
        console.log("Recipe data:", docSnap.data());
        return [true,docSnap.data()];
    } 
    else {
        // docSnap.data() will be undefined in this case
        console.log("No such recipe!");
        return [false,""];
    }
}

async function setGeneratedCount(uid, count) {
    try {
        await setDoc(doc(firestore, "recipes", uid), {
            count: count,
            lastUpdated: serverTimestamp()
        }).then(()=> {
            console.log("AI generated amount successfully written!");
        })
    }
    catch (e) {
        console.error("Error adding AI generated amount data: ", e);
    }
}

async function getGeneratedCount(uid) {
    //currently set 1 user can generate 10 times per day
    const MAX_AI_COUNT = 10; 
    const docRef = doc(firestore, "recipes", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        if (Object.keys(docSnap.data()).length === 0) { //no data for AI count
            return [false,""];
        }
        else { //got data for AI count
            //do the checking see if able to use
            const data = docSnap.data();
            const seconds = data.lastUpdated.seconds;
            const nanoseconds = data.lastUpdated.nanoseconds;
            const lastUpdatedDate = new Date(seconds * 1000 + nanoseconds / 1000000);
            const currentDate = new Date();

            if(lastUpdatedDate.getFullYear() === currentDate.getFullYear() &&
            lastUpdatedDate.getMonth() === currentDate.getMonth() &&
            lastUpdatedDate.getDate() === currentDate.getDate()) {
                console.log("AI generated amount data:", docSnap.data());
                return [true,docSnap.data()];
            }
            else { //reset as it is next day
                await setGeneratedCount(uid,MAX_AI_COUNT);
                return [false,""];
            }
        }
    } 
    else {
        // docSnap.data() will be undefined in this case
        console.log("No such AI generated amount!");
        return [false,""];
    }

    
}

async function decreaseGeneratedCount(uid) {
    const docRef = doc(firestore, "recipes", uid);

    // Atomically increment the population of the city by 50.
    await updateDoc(docRef, {
        count: increment(-1)
    });
}

export {addAndUpdateUserData, getUserData, addAndUpdateRecipe, getRecipe, getGeneratedCount, decreaseGeneratedCount};