"use client";

import 'firebase/auth';
import '../login/styles.css';
import Image from "next/image";
import { Input } from "@nextui-org/input";
import { useRouter } from 'next/navigation'
import { Button } from "@nextui-org/button";
import { withAuth } from '@/services/withAuth';
import { login, login1, loginMicrosoft } from '@/services/authService';
import React, { useEffect, useState } from "react";
import signInWithMicrosoft from "../../firebase/Auth/singin";
import CryptoJS from 'crypto-js';


const LoginPage = () => {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: ''
  });

  const clave = 'unaclavesecreta12345';

  // Manejador de cambios en los campos de entrada
  const handleChange = (e: any) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Manejador de inicio de sesión
  const handleLogin = async () => {
    try {
      // Intenta iniciar sesión
      const user = await login1(credentials);

      console.log(user);
      

      // Si las credenciales son correctas, redirige al dashboard
      if (user != null) {
        localStorage.setItem('userRole', user.rol_id);
        localStorage.setItem('firstName', user.nombre);
        localStorage.setItem('lastName', user.apellido);
        localStorage.setItem('carrera',user.carrera_id);
        localStorage.setItem('userId',user.id);

        router.push('/dashboard');
      } else {
        // Manejar el caso en que las credenciales no son correctas
        console.log('Credenciales Incorrectas');
        mostrarMensajeToast('Credenciales incorrectas. Inténtalo de nuevo.');

      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }


  



  // Manejador de inicio de sesión para Microsoft
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      const { result, error } = await signInWithMicrosoft();


      if (error) {
        console.log('error');
        return console.log(error);
      }

      // Lógica para obtener el nombre y apellido del usuario desde el backend en Microsoft
      //console.log("Nombre completo:", result?.displayName);
      const nombreCompleto = result?.displayName?.split(' ');
      const nombre = nombreCompleto?.[2];
      const apellido = nombreCompleto?.[0];

      // Crear un objeto con el nombre y apellido del usuario de microsoft
      const jsonDisplayName = {
        nombre: nombre,
        apellido: apellido
      }

      // Lógica para obtener el rol del usuario desde el backend en Microsoft (NECESARIO PARA EL LOGIN)
      const credencialesMicrosoft = {
        correo: result?.email,
        contrasena: "test",
      }

      const userIDMicrosoft = await loginMicrosoft(credencialesMicrosoft)

      if (userIDMicrosoft != null) {
        localStorage.setItem('userRoleMicrosoft', userIDMicrosoft);
        localStorage.setItem('nombreMicrosoft', jsonDisplayName.nombre);
        localStorage.setItem('apellidoMicrosoft', jsonDisplayName.apellido);
        
        router.push('/dashboard');

      } else {
        // Manejar el caso en que las credenciales no son correctas
        console.log('Credenciales Incorrectas');
        mostrarMensajeToast('Credenciales incorrectas. Inténtalo de nuevo.');

      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const [mostrarToast, setMostrarToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  const mostrarMensajeToast = (mensaje: any) => {
    setMensajeToast(mensaje);
    setMostrarToast(true);

    // Ocultar el toast después de cierto tiempo (por ejemplo, 5 segundos)
    setTimeout(() => {
      setMostrarToast(false);
    }, 5000);
  };

  useEffect(() => {
    // Elimina los datos del usuario del almacenamiento local
    localStorage.removeItem('userRole');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');

    // Elimina los datos del usuario de Microsoft del almacenamiento local
    localStorage.removeItem('userRoleMicrosoft');
    localStorage.removeItem('nombreMicrosoft');
    localStorage.removeItem('apellidoMicrosoft');
  }, []);

  return (
    <>
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div
          className="bg-white p-5 rounded-5 text-secondary shadow rounded-lg"
          style={{ width: '25rem' }}>
          <div
            className="flex justify-center">
            <Image src="/logoUta.png"
              alt="login-icon" width={175} height={175} />
          </div>

          <div className="text-center text-2xl font-bold customcolor">Inicio de Sesión</div>
          <div className="mt-4">
            <div className="flex items-center bg-custom-bg-color">
              <div className="p-2">
                <Image src="/username-icon.svg" alt="username-icon" width={16} height={16} />
              </div>

              <Input type="email" label="Email" radius="none" name='correo'
                onChange={handleChange}
              />
            </div>

          </div>
          <div className="mt-1">
            <div className="flex items-center bg-custom-bg-color">
              <div className="p-2">
                <Image src="/password-icon.svg" alt="password-icon" width={16} height={16} />
              </div>

              <Input type="password" label="Contraseña" radius="none" name='contrasena'
                onChange={handleChange}
              />

            </div>
          </div>
          <div className="flex justify-around mt-1">
            <div className="flex items-center gap-1">
              {/* Contenido adicional */}
            </div>
            <div className="pt-1">
              {/* Otro contenido */}
            </div>
          </div>

          {/* SECCION DE BOTONES */}
          <Button className="bg-custom-bg-color text-white w-full py-2 font-semibold mt-4 shadow-sm"
            onClick={handleLogin}>
            Iniciar Sesión
          </Button>

          <div className="flex gap-1 justify-center mt-1">
            {/* Contenido adicional */}
          </div>

          <div className="p-3">
            <div className="border-b text-center" style={{ height: '0.9rem' }}>
              <span className="bg-white px-3 customcolor">o</span>
            </div>
          </div>

          <Button className="bg-custom text-white w-full py-2 font-semibold mt-4 shadow-sm"
            onClick={handleForm}
          >
            <Image src="/Microsoft.svg" alt="google-icon" width={20} height={20} />
            Continuar con Microsoft
          </Button>
        </div>
      </div>

      {
        mostrarToast && (
          <div
            id="toast-default"
            className="fixed top-8 right-8 z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
              </svg>
              <span className="sr-only">Warning icon</span>
            </div>
            <div className="ms-3 text-sm font-normal">{mensajeToast}</div>
            <button
              type="button"
              className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-default"
              aria-label="Close"
              onClick={() => setMostrarToast(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        )}
    </>

  );
}

export default withAuth(LoginPage);