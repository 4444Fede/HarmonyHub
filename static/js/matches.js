const matches = [
    { name: "John Doe", genres: ["Rock", "Jazz", "Blues"] },
    { name: "Jane Smith", genres: ["Pop", "Hip Hop", "Classical"] },
    { name: "Michael Brown", genres: ["Electronic", "Reggae", "Country"] },
    { name: "Emily Davis", genres: ["Metal", "Rock", "Blues"] },
    { name: "Sophia White", genres: ["Pop", "Electronic", "Jazz"] }
];

const userGenres = ["Rock", "Pop"];

function sortMatchesByGenre(matches) {
    return matches.sort((a, b) => {
        const commonGenresA = a.genres.filter(genre => userGenres.includes(genre)).length;
        const commonGenresB = b.genres.filter(genre => userGenres.includes(genre)).length;
        return commonGenresB - commonGenresA;
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
        genresElement.textContent = match.genres.join(', ');

        matchItem.appendChild(nameElement);
        matchItem.appendChild(genresElement);
        matchesContainer.appendChild(matchItem);
    });
}

function initMatches() {
    const sortedMatches = sortMatchesByGenre(matches);
    renderMatches(sortedMatches);
}

initMatches();
