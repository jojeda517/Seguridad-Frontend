"use client";
import Image from "next/image";
import '../login/styles.css';
import React from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import 'firebase/auth';
import signInWithMicrosoft from "../../firebase/Auth/singin";
import { signIn } from "next-auth/react"; 

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  //const navigate = useNavigate();
  const router = useRouter()

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

  const handleMicrosoftSignIn = async () => {
    await signIn("microsoft");
  };

	return (
		<div className="flex justify-center items-center h-screen" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white p-5 rounded-5 text-secondary shadow rounded-lg"  style={{ width: '25rem' }}>
        <div className="flex justify-center">
          <Image src="/logoUta.png" alt="login-icon"  width={175} height={175} />
        </div>
        <div className="text-center text-4xl font-bold customcolor">Login</div>
        <div className="mt-4">
          <div className="flex items-center bg-custom-bg-color">
            <div className="p-2">
              <Image src="/username-icon.svg" alt="username-icon" width={16} height={16} />
            </div>
            <Input type="email" label="Email" radius="none"/>
          </div>
        </div>
        <div className="mt-1">
          <div className="flex items-center bg-custom-bg-color">
            <div className="p-2">
              <Image src="/password-icon.svg" alt="password-icon" width={16} height={16} />
            </div>
            <Input type="password" label="Contraseña" radius="none"/>
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
        <Button className="bg-custom-bg-color text-white w-full py-2 font-semibold mt-4 shadow-sm">
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
      </div>
    </div>
	);
}