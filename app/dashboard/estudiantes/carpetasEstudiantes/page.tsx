"use client";

import React, { useEffect, useState } from "react";
import { EditIcon } from "../../administradores/EditIcon";
import { DeleteIcon } from "../../administradores/DeleteIcon";
import "../../facultades/styles.css";
import { Toast } from "@/components/toast";
import { withAuth } from "@/services/withAuth";



const carpetasPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [categorias, setCategorias] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showFormulario, setShowFormulario] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [carreras, setCarreras] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userCarrera, setUserCarrera] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    id: "0",
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    direccion: "",
    celular: "",
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedEstudiantes, setSelectedEstudiantes] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchEstudiantesAndCarreras = async () => {
      try {
        const carrera_id = localStorage.getItem("carrera");
        setUserCarrera(carrera_id);

        const estudiantesResponse = await fetch(
          `http://3.144.231.126/api/v1/categorias/${carrera_id}`
        );
        if (estudiantesResponse.ok) {
          const estudiantesData = await estudiantesResponse.json();
          setCategorias(estudiantesData);
        } else {
          throw new Error("Error fetching estudiantes");
        }

        const carrerasResponse = await fetch(
          `http://3.144.231.126/api/v1/carrera/${carrera_id}`
        );
        if (carrerasResponse.ok) {
          const carrerasData = await carrerasResponse.json();
          setCarreras(carrerasData);

          if (carrerasData.length > 0) {
            const firstCarreraId = carrerasData[0].id;
            setFormData((prevFormData) => ({
              ...prevFormData,
              carrera_id: firstCarreraId,
            }));
          }
        } else {
          throw new Error("Error fetching carreras");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEstudiantesAndCarreras();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const totalPages = Math.ceil(categorias.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categorias.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCarpetas = (estudiante) => {
    window.location.href = `/dashboard/estudiantes/carpetasEstudiantes/archivosEstudiante`;
  };


  const [mostrarToast, setMostrarToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState("");

  const mostrarMensajeToast = (mensaje) => {
    setMensajeToast(mensaje);
    setMostrarToast(true);

    // Ocultar el toast después de cierto tiempo (por ejemplo, 5 segundos)
    setTimeout(() => {
      setMostrarToast(false);
    }, 5000);
  };





  return (
    <>
      <div className="text-center font-bold my-4 mb-8">
        <h1>Carpetas Estudiante</h1>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th key="columna-cedula" scope="col" className="px-6 py-3">
                Carpeta
              </th>

            </tr>
          </thead>
          <tbody>
            {currentItems.map((categorias) => (
              <tr
                key={categorias.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => handleCarpetas(categorias)}
              >
                <td className="flex items-center px-6 py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2" // Agregamos margen a la derecha para separar el ícono del texto
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                  {categorias.nombre}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation example" className="mt-4">
        <ul className="inline-flex -space-x-px text-sm">
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : ""
                  }`}
                onClick={() => handlePageChange(index + 1)}
                style={{ marginTop: "8px" }}
              >
                {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>



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
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
export default withAuth(carpetasPage);