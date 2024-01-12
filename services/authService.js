// service/authService.js
const CryptoJS = require('crypto-js');

const clave = 'unaclavesecreta12345';

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
        console.log(credenciales);
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

export const login1 = async (credentials) => {
    try {
      // Obtén el usuario de la base de datos utilizando el correo proporcionado

        console.log(credentials);
        const email={correo: credentials.correo } 
        console.log(email);
        //const encriptadoclave = CryptoJS.AES.encrypt(claveencriptada, clave).toString();
        //console.log(encriptadoclave);

      const response = await fetch('http://3.21.41.85/api/v1/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await response.json();
      console.log(userData);
      console.log('formulario',credentials.contrasena);
      console.log('json',userData.contrasena);
  
      // Verifica si el usuario existe y si la contraseña coincide
      if (userData && checkPassword(credentials.contrasena, userData.contrasena)) {
        return userData;
      } else {
        return null; // Usuario no encontrado o contraseña incorrecta
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };
  
  // Función para comparar contraseñas encriptadas
  const checkPassword = (inputPassword, storedPassword) => {
    // Decifra la contraseña almacenada antes de compararla
    const decryptedPassword = CryptoJS.AES.decrypt(storedPassword, clave).toString(CryptoJS.enc.Utf8);
    
    // Compara la contraseña ingresada con la contraseña almacenada
    return inputPassword === decryptedPassword;
  };
