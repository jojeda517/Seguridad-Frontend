"use client";

import { useRouter } from 'next/navigation';
import React from 'react';

export default function Formulario() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el formulario, como enviar datos al servidor, etc.
    // Después de manejar la lógica del formulario, puedes redirigir a otra página:
    router.push('/dashboard/facultades');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        onSubmit={handleSubmit} // Agrega esta función al evento onSubmit del formulario
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nombre"
            type="text"
            placeholder="Ingrese el nombre de la facultad"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">
            Logo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="logo"
            type="text"
            placeholder="Ingrese la URL del logo"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sigla">
            Sigla
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="sigla"
            type="text"
            placeholder="Ingrese la sigla de la facultad"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit" // Cambiado a type="submit" para activar la función handleSubmit
          >
            Registrar Facultad
          </button>
        </div>
      </form>
    </div>
  );
}
