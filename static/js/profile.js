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
                const generos = Object.keys(gustos[0]).filter(key => key.startsWith('Afinidad_'));

                generos.forEach(genero => {
                    const generoElement = document.createElement('div');
                    generoElement.className = 'genero-container';

                    const slider = document.createElement('input');
                    slider.type = 'range';
                    slider.min = 0;
                    slider.max = 10;
                    slider.value = gustos[0][genero];
                    slider.className = 'gustos-slider';
                    slider.id = genero;
                    slider.setAttribute('list', 'tickmarks');

                    const datalist = document.createElement('datalist');
                    datalist.id = 'tickmarks';
                    for (let i = 0; i <= 10; i++) {
                        const option = document.createElement('option');
                        option.value = i;
                        if (i === 0 || i === 5 || i === 10) {
                            option.setAttribute('label', `${i}`);
                        }
                        datalist.appendChild(option);
                    }

                    const label = document.createElement('label');
                    label.setAttribute('for', genero);
                    label.innerText = `¿Cuánto te gusta ${genero.replace('Afinidad_', '').replace(/_/g, ' ')}?`;

                    generoElement.appendChild(label);
                    generoElement.appendChild(slider);
                    generoElement.appendChild(datalist);

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
            gustos[slider.id] = slider.value;
        });

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
        })
        .catch(error => console.error('Error al guardar los gustos:', error));
    });
});
