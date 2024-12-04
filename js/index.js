async function loadArticles() {
    try {
        const response = await fetch('./datos.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar los datos.');
        }

        const data = await response.json(); 

        const { articles, users } = data; 
        const postsTable = document.getElementById('postsTable');
        postsTable.innerHTML = ''; 

        articles.forEach(article => {
            // Asegurar que la comparación sea consistente
            const author = users.find(user => user.id.toString() === article.autorId.toString());

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${article.title}</td>
                <td>${author ? author.name : 'Desconocido'}</td>
                <td>
                    <a class="btn btn-info" href="post-details.html?id=${article.id}">Ver Detalles</a>
                </td>
            `;

            postsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadArticles);
