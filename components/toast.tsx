"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";

export const Toast = () => {
        const [mostrarToast, setMostrarToast] = useState(false);
      const [mensajeToast, setMensajeToast] = useState('');
      /**
       * 
       */


     const  mostrarMensajeToast = (mensaje) => {
        setMensajeToast(mensaje);
        setMostrarToast(true);
    
        // Ocultar el toast después de cierto tiempo (por ejemplo, 5 segundos)
        setTimeout(() => {
          setMostrarToast(false);
        }, 5000);
      };

	return (
        <>
        {mostrarToast && (
  
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
    <div className="ms-3 text-sm font-normal">{mensajeToast}.</div>
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
};