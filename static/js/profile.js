document.addEventListener('DOMContentLoaded', () => {
    // Obtener los gustos desde el servidor
    fetch('/api/gustos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status}`);
            }
            return response.json();
        })
        .then(gustos => {
            console.log("Datos de gustos recibidos:", gustos);

            const gustosContainer = document.getElementById('gustos-container');
            if (gustos.length > 0) {
                // Suponiendo que los gustos tienen claves como 'Afinidad_Rock', 'Afinidad_Jazz', etc.
                const generos = Object.keys(gustos[0]).filter(key => key.startsWith('Afinidad_')); // Filtra solo las claves que son afinidades

                generos.forEach(genero => {
                    const generoElement = document.createElement('div');
                    generoElement.className = 'genero-container';
                    generoElement.innerText = genero.replace('Afinidad_', '').replace(/_/g, ' '); // Mostrar el nombre del género sin 'Afinidad_'

                    const slider = document.createElement('input');
                    slider.type = 'range';
                    slider.min = 0;
                    slider.max = 10;
                    slider.value = gustos[0][genero];
                    slider.className = 'gustos-slider';
                    slider.id = genero;

                    const label = document.createElement('label');
                    label.setAttribute('for', genero);
                    label.innerText = `¿Cuánto te gusta ${genero.replace('Afinidad_', '').replace(/_/g, ' ')}?`;

                    // Crear un contenedor con el slider
                    generoElement.appendChild(label);
                    generoElement.appendChild(slider);

                    gustosContainer.appendChild(generoElement);
                });
            }
        })
        .catch(error => console.error('Error al obtener los gustos:', error));

    // Guardar los gustos seleccionados
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
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta al guardar gustos: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Gustos guardados con éxito:', data);
            // Manejar la respuesta, mostrar un mensaje o redirigir
        })
        .catch(error => console.error('Error al guardar los gustos:', error));
    });
});
