// Función para obtener los gustos musicales y los perfiles desde la API
async function fetchProfiles() {
    try {
        const response = await fetch('/api/gustos'); // Fetch a la ruta Flask
        if (!response.ok) {
            throw new Error('Error al obtener los datos de gustos');
        }
        const userGustos = await response.json(); // Datos del usuario logueado

        const responseProfiles = await fetch('/api/perfiles'); // Nueva API para otros usuarios
        if (!responseProfiles.ok) {
            throw new Error('Error al obtener los perfiles');
        }
        const profiles = await responseProfiles.json(); // Perfiles de otros usuarios

        return { userGustos, profiles };
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Función para calcular la distancia entre dos perfiles
function calculateDistance(userGenres, profileGenres) {
    let distance = 0;
    for (let genre in userGenres) {
        const diff = userGenres[genre] - profileGenres[genre];
        distance += diff * diff;
    }
    return Math.sqrt(distance);
}

// Ordena los perfiles de acuerdo a la distancia calculada
function sortMatchesByGenre(userGenres, profiles) {
    return profiles.sort((a, b) => {
        const distanceA = calculateDistance(userGenres, a.genres);
        const distanceB = calculateDistance(userGenres, b.genres);
        return distanceA - distanceB;
    });
}

// Función para renderizar los matches en el HTML
function renderMatches(matches) {
    const matchesContainer = document.getElementById('matches-container');
    matchesContainer.innerHTML = '';

    matches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.classList.add('match-item');

        const nameElement = document.createElement('h3');
        nameElement.textContent = match.name;

        // Determinar el género favorito
        const favoriteGenre = Object.entries(match.genres).reduce((maxGenre, [genre, affinity]) => {
            if (affinity > maxGenre.affinity) {
                return { genre, affinity };
            }
            return maxGenre;
        }, { genre: '', affinity: 0 });

        // Mostrar el género favorito
        const genreElement = document.createElement('p');
        let genreText = `Género Favorito: '${capitalizeGenre(favoriteGenre.genre)}'`;

        genreElement.textContent = genreText;

        // Botón "Match"
        const matchButton = document.createElement('button');
        matchButton.textContent = 'Match';

        matchItem.appendChild(nameElement);
        matchItem.appendChild(genreElement);
        matchItem.appendChild(matchButton);
        matchesContainer.appendChild(matchItem);
    });
}

// Función para capitalizar el primer carácter y manejar R&B correctamente
function capitalizeGenre(genre) {
    if (genre === 'rb') {
        return 'R&B';
    }
    return genre.charAt(0).toUpperCase() + genre.slice(1);
}

// Inicializa los matches
async function initMatches() {
    const { userGustos, profiles } = await fetchProfiles();
    if (!userGustos || !profiles) return;

    // Ajuste de los géneros con los valores que ya llegan
    const userGenres = {
        blues: parseInt(userGustos[0]?.Afinidad_Blues || 0),
        clasica: parseInt(userGustos[0]?.Afinidad_Clasica || 0),
        country: parseInt(userGustos[0]?.Afinidad_Country || 0),
        electronica: parseInt(userGustos[0]?.Afinidad_Electronica || 0),
        funk: parseInt(userGustos[0]?.Afinidad_Funk || 0),
        hipHop: parseInt(userGustos[0]?.Afinidad_Hip_Hop || 0),
        jazz: parseInt(userGustos[0]?.Afinidad_Jazz || 0),
        metal: parseInt(userGustos[0]?.Afinidad_Metal || 0),
        pop: parseInt(userGustos[0]?.Afinidad_Pop || 0),
        punk: parseInt(userGustos[0]?.Afinidad_Punk || 0),
        rb: parseInt(userGustos[0]?.Afinidad_R_B || 0),
        reggae: parseInt(userGustos[0]?.Afinidad_Reggae || 0),
        rock: parseInt(userGustos[0]?.Afinidad_Rock || 0),
        salsa: parseInt(userGustos[0]?.Afinidad_Salsa || 0),
        ska: parseInt(userGustos[0]?.Afinidad_Ska || 0),
    };

    // Ajuste de los perfiles
    const adjustedProfiles = profiles.map(profile => ({
        name: profile.Nombre,
        genres: {
            blues: parseInt(profile.Afinidad_Blues),
            clasica: parseInt(profile.Afinidad_Clasica),
            country: parseInt(profile.Afinidad_Country),
            electronica: parseInt(profile.Afinidad_Electronica),
            funk: parseInt(profile.Afinidad_Funk),
            hipHop: parseInt(profile.Afinidad_Hip_Hop),
            jazz: parseInt(profile.Afinidad_Jazz),
            metal: parseInt(profile.Afinidad_Metal),
            pop: parseInt(profile.Afinidad_Pop),
            punk: parseInt(profile.Afinidad_Punk),
            rb: parseInt(profile.Afinidad_R_B),
            reggae: parseInt(profile.Afinidad_Reggae),
            rock: parseInt(profile.Afinidad_Rock),
            salsa: parseInt(profile.Afinidad_Salsa),
            ska: parseInt(profile.Afinidad_Ska),
        }
    }));

    // Ordenar y renderizar los matches
    const sortedMatches = sortMatchesByGenre(userGenres, adjustedProfiles);
    renderMatches(sortedMatches);
}

initMatches();
