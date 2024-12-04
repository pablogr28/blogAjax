function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


async function loadArticleDetails() {
    try {
        const articleId = getQueryParam('id');
        if (!articleId) {
            throw new Error('No se proporcionó un ID de artículo en la URL.');
        }

        const response = await fetch('./datos.json');
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos del archivo JSON.');
        }

        const data = await response.json();

        if (!data.articles || !data.users || !data.comments) {
            throw new Error('Estructura inválida en el archivo JSON.');
        }

        const { articles, users, comments } = data;

        // Buscar artículo por ID
        const article = articles.find(a => a.id === articleId);
        if (!article) {
            throw new Error(`No se encontró un artículo con ID ${articleId}.`);
        }

        // Buscar autor del artículo
        const author = users.find(u => u.id.toString() === article.autorId.toString());

        // Mostrar detalles del artículo
        document.getElementById('postTitle').innerText = article.title;
        document.getElementById('postAuthor').innerText = `Autor: ${author ? author.name : 'Desconocido'}`;
        document.getElementById('postContent').innerText = article.content;

        // Filtrar y renderizar los comentarios del artículo
        const articleComments = comments.filter(c => c.articleId.toString() === articleId.toString());
        renderComments(articleComments, users);

        // Poblar el select de autores
        populateAuthorSelect(users);
    } catch (error) {
        console.error('Error al cargar los detalles:', error);
        alert(error.message);
    }
}

function renderComments(comments, users) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = ''; 

    comments.forEach(comment => {
        const commentAuthor = users.find(u => u.id.toString() === comment.userId.toString());
        const listItem = document.createElement('li');
        listItem.innerText = `${commentAuthor ? commentAuthor.name : 'Anónimo'}: ${comment.comment}`;
        commentsList.appendChild(listItem);
    });
}

function populateAuthorSelect(users) {
    const commentAuthorSelect = document.getElementById('commentAuthor');
    commentAuthorSelect.innerHTML = ''; 

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.innerText = user.name;
        commentAuthorSelect.appendChild(option);
    });
}

async function handleCommentFormSubmit(event) {
    event.preventDefault();

    const commentAuthor = document.getElementById('commentAuthor').value;
    const commentContent = document.getElementById('commentContent').value;
    const articleId = getQueryParam('id');

    if (!commentAuthor || !commentContent) {
        alert('Completa todos los campos del formulario.');
        return;
    }

    const newComment = {
        userId: commentAuthor,
        comment: commentContent,
        articleId: articleId
    };

    try {
        const response = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el comentario.');
        }

        const savedComment = await response.json();
        console.log('Comentario guardado:', savedComment);

        addCommentToList(savedComment);
        document.getElementById('commentForm').reset(); 
    } catch (error) {
        console.error('Error al enviar el comentario:', error);
        alert('No se pudo guardar el comentario.');
    }
}

function addCommentToList(comment) {
    const commentAuthorName = document.querySelector(`#commentAuthor option[value="${comment.userId}"]`).innerText;
    const commentsList = document.getElementById('commentsList');

    const listItem = document.createElement('li');
    listItem.innerText = `${commentAuthorName}: ${comment.comment}`;
    commentsList.appendChild(listItem);
}

document.addEventListener('DOMContentLoaded', () => {
    loadArticleDetails();
    document.getElementById('commentForm').addEventListener('submit', handleCommentFormSubmit);
});

