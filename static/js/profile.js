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

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = 0;
                slider.max = 10;
                slider.value = gustos[0][genero];
                slider.className = 'gustos-slider';
                slider.id = genero;

                const label = document.createElement('label');
                label.setAttribute('for', genero);
                label.innerText = `¿Cuánto te gusta ${genero.replace('Afinidad_', '')}?`;

                // Crear un contenedor con el slider
                generoElement.appendChild(label);
                generoElement.appendChild(slider);

                gustosContainer.appendChild(generoElement);
            });
        })
        .catch(error => console.error('Error al obtener los gustos:', error));

    document.getElementById('save-profile-btn').addEventListener('click', () => {
        const gustos = {};
        const sliders = document.querySelectorAll('.gustos-slider');

        sliders.forEach(slider => {
            gustos[slider.id] = slider.value; // Almacena el valor de cada slider por su ID
        });

        // Hacer la petición para guardar los gustos
        fetch('/api/guardar_gustos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gustos: gustos })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Gustos guardados:', data);
            // Manejar la respuesta, mostrar un mensaje o redirigir
        })
        .catch(error => console.error('Error al guardar los gustos:', error));
    });
});
