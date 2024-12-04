const apiURL = "http://localhost:3000/users"; // URL base de la API para usuarios

// Función para manejar el envío del formulario
async function handleUserFormSubmit(event) {
  event.preventDefault(); // Evitar el comportamiento por defecto del formulario

  // Obtener los valores del formulario
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;

  // Crear un nuevo usuario
  const newUser = {
    name: username,
    email: email,
  };

  try {
    // Realizar una solicitud POST a la API para guardar el nuevo usuario
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error(`Error al crear el usuario: ${response.statusText}`);
    }

    // Confirmar que el usuario fue creado exitosamente
    const createdUser = await response.json();
    console.log("Usuario creado:", createdUser);

    // Mostrar un mensaje de éxito
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.innerHTML = `<div class="alert alert-success">Usuario creado con éxito: ${createdUser.name}</div>`;

    // Resetear el formulario
    document.getElementById("userForm").reset();
  } catch (error) {
    console.error("Error al crear usuario:", error);

    // Mostrar un mensaje de error
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.innerHTML = `<div class="alert alert-danger">No se pudo crear el usuario. Intenta nuevamente.</div>`;
  }
}

// Asignar el evento al formulario
document.getElementById("userForm").addEventListener("submit", handleUserFormSubmit);
