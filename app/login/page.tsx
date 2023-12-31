"use client";
import Image from "next/image";
import '../login/styles.css';
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import 'firebase/auth';
import signInWithMicrosoft from "../../firebase/Auth/singin";

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  //const navigate = useNavigate();
  const router = useRouter()

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');


  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://3.21.41.85/api/v1/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          contrasena,
        }),
      });

      if (response.ok) {

        // Lógica para obtener el rol del usuario desde el backend
        const data = await response.json();

        // Almacena el rol en la sesión
        const role = data.rol_id;

        // Guarda el rol en localStorage
        localStorage.setItem('userRole', role);

        router.push('/dashboard');
      } else {
        // Si hay un error en la respuesta, maneja el error (puedes mostrar un mensaje, por ejemplo)
        setErrorMensaje('Credenciales incorrectas. Inténtalo de nuevo.');
        console.error('Error al iniciar sesión:', response.statusText);
      }
    } catch (error) {
      console.error('Error al conectarse con el servicio:', error);
    }
  };


  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log('estoy logueando');
    const { result, error } = await signInWithMicrosoft();
    if (error) {
      console.log('error');
      return console.log(error);

    }
    // else successful
    console.log('correcto');
    console.log(result);

    router.push('/dashboard')
  };


  return (
    <div className="flex justify-center items-center h-screen" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white p-5 rounded-5 text-secondary shadow rounded-lg" style={{ width: '25rem' }}>
        <div className="flex justify-center">
          <Image src="/logoUta.png" alt="login-icon" width={175} height={175} />
        </div>
        <div className="text-center text-4xl font-bold customcolor">Login</div>
        <div className="mt-4">
          <div className="flex items-center bg-custom-bg-color">
            <div className="p-2">
              <Image src="/username-icon.svg" alt="username-icon" width={16} height={16} />
            </div>
            <Input type="email" label="Email" radius="none"
              value={correo} // Asocia el valor del estado 'correo' al campo de entrada
              onChange={(e) => setCorreo(e.target.value)} />
          </div>
        </div>
        <div className="mt-1">
          <div className="flex items-center bg-custom-bg-color">
            <div className="p-2">
              <Image src="/password-icon.svg" alt="password-icon" width={16} height={16} />
            </div>
            <Input type="password" label="Contraseña" radius="none"
              value={contrasena} // Asocia el valor del estado 'contrasena' al campo de entrada
              onChange={(e) => setContrasena(e.target.value)} />
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
        <Button className="bg-custom-bg-color text-white w-full py-2 font-semibold mt-4 shadow-sm"
          onClick={handleLogin}>
          Login
        </Button>
        <div className="flex gap-1 justify-center mt-1">
          {/* Contenido adicional */}
        </div>
        <div className="p-3">
          <div className="border-b text-center" style={{ height: '0.9rem' }}>
            <span className="bg-white px-3 customcolor">or</span>
          </div>
        </div>
        <Button className="bg-custom text-white w-full py-2 font-semibold mt-4 shadow-sm"
          onClick={handleForm}>
          <Image src="/Outlook.svg" alt="google-icon" width={26} height={26} />
          Continuar con Outlook
        </Button>
        {errorMensaje && (
          <div className="text-red-500 text-sm text-center mt-2">{errorMensaje}</div>
        )}

      </div>
    </div>
  );
}