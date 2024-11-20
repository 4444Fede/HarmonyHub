// Simulación de un usuario logueado
const loggedUser = {
    name: 'Juan', // Nombre del usuario logueado
    genres: {
        rock: 8,   // Afinidad por Rock
        cumbia: 2, // Afinidad por Cumbia
        metal: 2,  // Afinidad por Metal
        clasica: 2 // Afinidad por Clásica
    }
};

// Simulación de los perfiles de otros usuarios, que también tienen sus afinidades de géneros
const profiles = [
    { name: "Agus", genres: { rock: 8, cumbia: 2, metal: 2, clasica: 2 } },
    { name: "Beto", genres: { rock: 7, cumbia: 8, metal: 5, clasica: 2 } },
    { name: "Claudio", genres: { rock: 2, cumbia: 7, metal: 2, clasica: 9 } },
    { name: "Dani", genres: { rock: 4, cumbia: 1, metal: 1, clasica: 1 } },
    { name: "Estefi", genres: { rock: 10, cumbia: 5, metal: 3, clasica: 8 } },
    { name: "Flor", genres: { rock: 5, cumbia: 9, metal: 7, clasica: 3 } }
];

// Función para calcular la distancia entre los gustos del usuario logueado y otro perfil (distancia euclidiana)
function calculateDistance(userGenres, profileGenres) {
    let distance = 0;
    for (let genre in userGenres) {
        const diff = userGenres[genre] - profileGenres[genre];
        distance += diff * diff; // Diferencia al cuadrado
    }
    return Math.sqrt(distance); // Distancia euclidiana
}

// Función para ordenar los perfiles según la afinidad con el usuario logueado
function sortMatchesByGenre(matches) {
    return matches.sort((a, b) => {
        const distanceA = calculateDistance(loggedUser.genres, a.genres);
        const distanceB = calculateDistance(loggedUser.genres, b.genres);
        return distanceA - distanceB; // Menor distancia es un mejor match
    });
}

// Función para mostrar los resultados de los matches
function renderMatches(matches) {
    const matchesContainer = document.getElementById('matches-container');
    matchesContainer.innerHTML = '';

    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.classList.add('match-item');

        const nameElement = document.createElement('h3');
        nameElement.textContent = match.name;

        const genresElement = document.createElement('p');
        // Mostrar los géneros y sus valores de afinidad
        const genresText = Object.keys(match.genres).map(genre => {
            return `${genre}: ${match.genres[genre]}`;
        }).join(', ');
        genresElement.textContent = genresText;

        matchItem.appendChild(nameElement);
        matchItem.appendChild(genresElement);
        matchesContainer.appendChild(matchItem);
    });
}

// Función para inicializar los matches
function initMatches() {
    // Filtrar los perfiles que no sean el usuario logueado
    const matches = profiles.filter(profile => profile.name !== loggedUser.name);

    // Ordenar los matches según la afinidad con el usuario logueado
    const sortedMatches = sortMatchesByGenre(matches);

    // Renderizar los matches ordenados
    renderMatches(sortedMatches);
}

// Ejecutar la inicialización de los matches
initMatches();
