const userNameElement = document.getElementById("user-name");
const genreSelect = document.getElementById("genre-select");
const selectedGenresContainer = document.getElementById("selected-genres");
const saveProfileBtn = document.getElementById("save-profile-btn");
const sexualitySelect = document.getElementById("sexuality-select");
const relationshipSelect = document.getElementById("relationship-select");

let selectedGenres = [];

window.onload = function() {
    const userName = localStorage.getItem("userName") || "Usuario";
    userNameElement.textContent = userName;
    selectedGenres = JSON.parse(localStorage.getItem("selectedGenres")) || [];
    updateSelectedGenresDisplay();
};

function updateSelectedGenresDisplay() {
    selectedGenresContainer.innerHTML = '';
    selectedGenres.forEach(genre => {
        const genreDiv = document.createElement("div");
        genreDiv.classList.add("selected-genre");
        genreDiv.textContent = genre;

        const removeButton = document.createElement("span");
        removeButton.textContent = "✖";
        removeButton.classList.add("remove-genre");
        removeButton.onclick = () => removeGenre(genre);

        genreDiv.appendChild(removeButton);
        selectedGenresContainer.appendChild(genreDiv);
    });
}

genreSelect.addEventListener("change", (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
    selectedGenres = selectedOptions;
    updateSelectedGenresDisplay();
});

function removeGenre(genre) {
    selectedGenres = selectedGenres.filter(g => g !== genre);
    updateSelectedGenresDisplay();
}

saveProfileBtn.addEventListener("click", () => {
    const sexuality = sexualitySelect.value;
    const relationship = relationshipSelect.value;

    localStorage.setItem("selectedGenres", JSON.stringify(selectedGenres));
    localStorage.setItem("userName", userNameElement.textContent); 
    localStorage.setItem("sexuality", sexuality);
    localStorage.setItem("relationship", relationship);

    alert("Cambios guardados!");
});
