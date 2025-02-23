// Ensure the script runs only after the page loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ poll.js is running!");

    // Check if Firebase is available
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase not loaded! Check script tags in poll.html");
        return;
    }

    // Initialize Firebase (Uses globally loaded Firebase from poll.html)
    const firebaseConfig = {
        apiKey: "AIzaSyDgpA7bQqbxB6FHGvzH3hhsTEjj5HqfOPk",
        authDomain: "webpoll-df05f.firebaseapp.com",
        projectId: "webpoll-df05f",
        storageBucket: "webpoll-df05f.appspot.com",
        messagingSenderId: "950117028692",
        appId: "1:950117028692:web:9dba1d31ea590f9aa8eec1",
        measurementId: "G-0ECNVS3QVJ"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    console.log("🔥 Firebase initialized:", firebase);
    console.log("🔥 Firestore database reference:", db);

    // Reference to poll document
    const pollRef = db.collection("poll").doc("TheGI6hg4tCo4dWsTp6Z");

    // Function to submit a vote
    async function vote(option) {
        try {
            const pollSnap = await pollRef.get();
            if (pollSnap.exists) {
                // ✅ Increase the count for the selected option
                await pollRef.update({
                    [option]: firebase.firestore.FieldValue.increment(1)
                });
            } else {
                // ✅ If the document doesn’t exist (first vote), create it
                await pollRef.set({ yes: 0, no: 0, maybe: 0, [option]: 1 });
            }
            alert("Vote submitted!");
        } catch (error) {
            console.error("❌ Error submitting vote:", error);
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
    pollRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
            console.log("🔥 Live update received:", docSnap.data());
            updateResults(docSnap.data());
        } else {
            console.log("❌ No poll data found.");
        }
    });

    // Function to update UI with results
    function updateResults(data) {
        document.getElementById("results").innerHTML = `
            <li>Yes: ${data.yes} votes</li>
            <li>No: ${data.no} votes</li>
            <li>Maybe: ${data.maybe} votes</li>
        `;
    }
});
