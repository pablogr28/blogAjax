// Función para cargar datos desde datos.json y renderizar la tabla
async function loadArticles() {
    try {
        // Realiza la solicitud al archivo datos.json
        const response = await fetch('./datos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar los datos.');
        }

        const data = await response.json(); // Convierte la respuesta en JSON

        const { articles, users } = data; // Extrae los artículos y usuarios
        const postsTable = document.getElementById('postsTable');
        postsTable.innerHTML = ''; // Limpia la tabla antes de agregar datos

        // Genera las filas para cada artículo
        articles.forEach(article => {
            const author = users.find(user => user.id === article.autorId);
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${article.title}</td>
                <td>${author ? author.name : 'Desconocido'}</td>
                <td>
                    <button><a href="post-details.html?id=${article.id}">Ver Detalles</a></button>
                </td>
            `;

            postsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', loadArticles);
