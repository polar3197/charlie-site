// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgpA7bQqbxB6FHGvzH3hhsTEjj5HqfOPk",
    authDomain: "webpoll-df05f.firebaseapp.com",
    databaseURL: "https://webpoll-df05f-default-rtdb.firebaseio.com/",  // Ensure correct database URL
    projectId: "webpoll-df05f",
    storageBucket: "webpoll-df05f.appspot.com",
    messagingSenderId: "950117028692",
    appId: "1:950117028692:web:9dba1d31ea590f9aa8eec1",
    measurementId: "G-0ECNVS3QVJ"
};

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to submit a vote
function vote(option) {
    const voteRef = ref(db, "poll/" + option);

    runTransaction(voteRef, (currentVotes) => {
        return (currentVotes || 0) + 1; // Increase the count atomically
    });
}

// Event listener for form submission
document.getElementById("poll-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedOption = document.querySelector('input[name="vote"]:checked');
    if (!selectedOption) {
        alert("Please select an option.");
        return;
    }

    vote(selectedOption.value);
    alert("Vote submitted!");
});

// Live update results in real time
const resultsRef = ref(db, "poll");
onValue(resultsRef, (snapshot) => {
    const results = snapshot.val();
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    if (results) {
        Object.entries(results).forEach(([option, count]) => {
            let li = document.createElement("li");
            li.textContent = `${option}: ${count} votes`;
            resultsList.appendChild(li);
        });
    }
});
