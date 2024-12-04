const apiURL = "http://localhost:3000/articles";
const authorsURL = "http://localhost:3000/users";

// Elementos del DOM
const postForm = document.getElementById("postForm");
const statusMessage = document.getElementById("statusMessage");
const postAuthorSelect = document.getElementById("postAuthor");

// Cargar autores al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetch(authorsURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los autores: ${response.statusText}`);
            }
            return response.json();
        })
        .then(users => populateAuthorSelect(users))
        .catch(error => console.error("Error cargando autores:", error));
});

// Llenar el select con los autores
function populateAuthorSelect(users) {
    postAuthorSelect.innerHTML = ""; // Limpiar opciones previas
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.innerText = user.name;
        postAuthorSelect.appendChild(option);
    });
}

// Manejar envío del formulario
postForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar recarga de página

    // Capturar valores del formulario
    const postTitle = document.getElementById("postTitle").value;
    const postAuthor = postAuthorSelect.value; // ID del autor
    const postContent = document.getElementById("postContent").value;

    // Crear objeto para el nuevo post
    const newPost = {
        title: postTitle,
        content: postContent,
        autorId: parseInt(postAuthor) // Asegurar que sea un número
    };

    // Enviar post al servidor
    fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPost)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al guardar el post: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            statusMessage.innerHTML = `<div class="alert alert-success">Post agregado con éxito: ID ${data.id}</div>`;
            postForm.reset(); // Limpiar formulario
        })
        .catch(error => {
            console.error("Error al agregar el post:", error);
            statusMessage.innerHTML = `<div class="alert alert-danger">Error al agregar el post: ${error.message}</div>`;
        });
});
