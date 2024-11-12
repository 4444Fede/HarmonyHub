document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/gustos')
        .then(response => response.json())
        .then(gustos => {
            const gustosContainer = document.getElementById('gustos-container');
            const generos = Object.keys(gustos[0]);

            generos.forEach(genero => {
                const generoElement = document.createElement('div');
                generoElement.className = 'genero-container';
                generoElement.innerText = genero.replace('Afinidad_', '');
                
                generoElement.onclick = () => {
                    console.log(`Género seleccionado: ${genero}`);
                };

                gustosContainer.appendChild(generoElement);
            });
        })
        .catch(error => console.error('Error al obtener los gustos:', error));
});
