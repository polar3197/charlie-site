// Import necessary Firebase Firestore modules
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgpA7bQqbxB6FHGvzH3hhsTEjj5HqfOPk",
    authDomain: "webpoll-df05f.firebaseapp.com",
    projectId: "webpoll-df05f",
    storageBucket: "webpoll-df05f.appspot.com",
    messagingSenderId: "950117028692",
    appId: "1:950117028692:web:9dba1d31ea590f9aa8eec1",
    measurementId: "G-0ECNVS3QVJ"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to poll document
const pollRef = doc(db, "poll", "TheGI6hg4tCo4dWsTp6Z"); // Match the document ID

// Function to submit a vote
async function vote(option) {
    try {
        const pollSnap = await getDoc(pollRef);
        if (pollSnap.exists()) {
            // ✅ Increase the count for the selected option
            await updateDoc(pollRef, {
                [option]: pollSnap.data()[option] + 1
            });
        } else {
            // ✅ If the document doesn’t exist (first vote), create it
            await setDoc(pollRef, { yes: 0, no: 0, maybe: 0, [option]: 1 });
        }
        alert("Vote submitted!");
    } catch (error) {
        console.error("Error submitting vote:", error);
    }
}

// Handle form submission
document.getElementById("poll-form").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const selectedOption = document.querySelector('input[name="vote"]:checked');
    if (!selectedOption) {
        alert("Please select an option.");
        return;
    }

    vote(selectedOption.value);
});

// Live update results in real time
onSnapshot(pollRef, (docSnap) => {
    if (docSnap.exists()) {
        updateResults(docSnap.data());
    }
});

// Function to update poll results dynamically
function updateResults(data) {
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = `
        <li>Yes: ${data.yes} votes</li>
        <li>No: ${data.no} votes</li>
        <li>Maybe: ${data.maybe} votes</li>
    `;
}
