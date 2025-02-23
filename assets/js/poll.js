document.getElementById("poll-form").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get selected option
  const selectedOption = document.querySelector('input[name="vote"]:checked');
  if (!selectedOption) {
    alert("Please select an option.");
    return;
  }

  // Save vote locally (since GitHub Pages is static)
  let votes = JSON.parse(localStorage.getItem("pollVotes")) || {};
  votes[selectedOption.value] = (votes[selectedOption.value] || 0) + 1;
  localStorage.setItem("pollVotes", JSON.stringify(votes));

  // Show results
  displayResults();
});

// Display stored votes
function displayResults() {
  let votes = JSON.parse(localStorage.getItem("pollVotes")) || {};
  const resultsList = document.getElementById("results");
  resultsList.innerHTML = ""; // Clear old results

  for (const [option, count] of Object.entries(votes)) {
    let li = document.createElement("li");
    li.textContent = `${option}: ${count} votes`;
    resultsList.appendChild(li);
  }
}

// Load results on page load
displayResults();
