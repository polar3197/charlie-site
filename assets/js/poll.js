// Ensure script runs after page loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ poll.js is running!");

    // Check if Firebase is available
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase not loaded! Check script tags in poll.html");
        return;
    }

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
                // ✅ If the document doesn’t exist, create it
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
