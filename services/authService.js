// service/authService.js

// Función para manejar la respuesta de la solicitud
const handleResponse = async (response) => {
    if (response.ok) {
        return await response.json();
    } else {
        console.log('Error al realizar la solicitud');
    }
};

// Función para realizar la solicitud de inicio de sesión
export const login = async (credenciales) => {
    try {
        // Realiza la solicitud POST al endpoint de inicio de sesión
        const response = await fetch('http://3.21.41.85/api/v1/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credenciales)
        });

        // Maneja la respuesta utilizando la función handleResponse
        return await handleResponse(response);
    } catch (error) {
        // Maneja errores durante la solicitud
        console.log('Error al iniciar sesión', error);
    }
}

export const loginMicrosoft = async (credenciales) => {
    try {
        // Realiza la solicitud POST al endpoint de inicio de sesión
        const response = await fetch('http://3.21.41.85/api/v1/usuario/login/microsoft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credenciales)
        });

        // Maneja la respuesta utilizando la función handleResponse
        return await handleResponse(response);
    } catch (error) {
        // Maneja errores durante la solicitud
        console.log('Error al iniciar sesión', error);
    }
}
