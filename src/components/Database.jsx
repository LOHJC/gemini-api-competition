
import { firestore } from "../lib/firebaseSetup"
import { doc, setDoc, getDoc } from "firebase/firestore"; 


async function addAndUpdateUserData(uid, email, name, height, weight, goal) {
    try {
        await setDoc(doc(firestore, "users", uid), {
          email: email,
          name: name,
          height: height,
          weight: weight,
          goal: goal
        }).then(()=> {
            console.log("Document successfully written!");
        })
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function getUserData(uid) {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return [true,docSnap.data()];
    } 
    else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return [false,""];
    }
}

export {addAndUpdateUserData, getUserData};