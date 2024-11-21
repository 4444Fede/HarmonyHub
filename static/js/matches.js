// Obtén el usuario logueado desde el template.
const loggedUser = window.loggedUser;

// Si el usuario no está definido, lanza un error útil.
if (!loggedUser || !loggedUser.genres) {
    console.error("El usuario logueado no está definido correctamente.");
    throw new Error("Faltan datos del usuario logueado.");
}

// Simulación de los perfiles de otros usuarios.
const profiles = [
    { name: "Agus", genres: { rock: 8, cumbia: 2, metal: 2, clasica: 2 } },
    { name: "Beto", genres: { rock: 7, cumbia: 8, metal: 5, clasica: 2 } },
    { name: "Claudio", genres: { rock: 2, cumbia: 7, metal: 2, clasica: 9 } },
    { name: "Dani", genres: { rock: 4, cumbia: 1, metal: 1, clasica: 1 } },
    { name: "Estefi", genres: { rock: 10, cumbia: 5, metal: 3, clasica: 8 } },
    { name: "Flor", genres: { rock: 5, cumbia: 9, metal: 7, clasica: 3 } }
];

function calculateDistance(userGenres, profileGenres) {
    let distance = 0;
    for (let genre in userGenres) {
        const diff = userGenres[genre] - profileGenres[genre];
        distance += diff * diff;
    }
    return Math.sqrt(distance); 
}

function sortMatchesByGenre(matches) {
    return matches.sort((a, b) => {
        const distanceA = calculateDistance(loggedUser.genres, a.genres);
        const distanceB = calculateDistance(loggedUser.genres, b.genres);
        return distanceA - distanceB;
    });
}

function renderMatches(matches) {
    const matchesContainer = document.getElementById('matches-container');
    matchesContainer.innerHTML = '';

    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.classList.add('match-item');

        const nameElement = document.createElement('h3');
        nameElement.textContent = match.name;

        const genresElement = document.createElement('p');
        const genresText = Object.keys(match.genres).map(genre => {
            return `${genre}: ${match.genres[genre]}`;
        }).join(', ');
        genresElement.textContent = genresText;

        matchItem.appendChild(nameElement);
        matchItem.appendChild(genresElement);
        matchesContainer.appendChild(matchItem);
    });
}

function initMatches() {
    const matches = profiles.filter(profile => profile.name !== loggedUser.name);

    const sortedMatches = sortMatchesByGenre(matches);

    renderMatches(sortedMatches);
}

initMatches();
