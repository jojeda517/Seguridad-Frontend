"use client";

import React, { useEffect, useState } from "react";
import { EditIcon } from "../../../administradores/EditIcon";
import { DeleteIcon } from "../../../administradores/DeleteIcon";
import { DownloadIcon } from "../../../administradores/DownloadIcon";
import "../../../facultades/styles.css";
import { Toast } from "@/components/toast";
import { withAuth } from "@/services/withAuth";


const archivosPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [documentos, setDocumentos] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showFormulario, setShowFormulario] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [categorias, setCategorias] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userCarrera, setUserCarrera] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [studentId, setStudentId] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userId, setuserId] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedFile, setSelectedFile] = useState(new File([], 'default.txt'));


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    id: '0',
    id_categoria: '0',
    id_usuario: '0',
    id_estudiante: '0',
    nombre: '',
    descripcion: '',
    fecha: '2024-01-05T02:01:59.787Z'
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedEstudiantes, setSelectedEstudiantes] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchEstudiantesAndCarreras = async () => {
      try {
        const carrera_id = localStorage.getItem("carrera");
        const estudiante_id = localStorage.getItem("StudentId");
        const user_id = localStorage.getItem("userId");
        // Modificado a 'selectedStudentId'
        setuserId(user_id);
        setUserCarrera(carrera_id);
        setStudentId(estudiante_id);

        const categoriaResponse = await fetch(
          `http://3.21.41.85/api/v1/categorias/${carrera_id}`
        );

        if (categoriaResponse.ok) {
          const categoriaData = await categoriaResponse.json();
          setCategorias(categoriaData);

          if (estudiante_id) { // Comprobación si 'estudiante_id' está definido
            const documentosResponse = await fetch(
              `http://3.21.41.85/api/v1/documento/${estudiante_id}/${categoriaData[0]?.id}` // Accediendo al primer elemento de 'categoriaData' para obtener la propiedad 'id'
            );

            if (documentosResponse.ok) {
              const documentosData = await documentosResponse.json();
              setDocumentos(documentosData);
            } else {
              throw new Error("Error fetching estudiantes");
            }
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

  const totalPages = Math.ceil(documentos.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = documentos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const handleDelete = (id) => {
    fetch(`http://3.21.41.85/api/v1/documento/${id}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDocumentos((prevDocumentos) =>
            prevDocumentos.filter((documentos) => documentos.id !== id)
          );
          mostrarMensajeToast("Estudiante eliminada");
        } else {
          throw new Error("Failed to delete");
        }
      })
      .catch((error) => console.error("Error deleting:", error));
    //mostrarMensajeToast("Error al eliminar");
  };

  const handleFormularioToggle = () => {
    setShowFormulario((prevState) => !prevState); // Cambia el estado para mostrar u ocultar el formulario
  };

  const handleInsert = (e) => {
    e.preventDefault();

    fetch(`http://3.21.41.85/api/v1/documento/${userId}/${categorias[0]?.id}/${studentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to register student");
      })
      .then((data) => {
        setDocumentos((prevDocumentos) => [...prevDocumentos, data.result]);
        setFormData({
          id: '0',
          id_categoria: '0',
          id_usuario: '0',
          id_estudiante: '0',
          nombre: '',
          descripcion: '',
          fecha: '2024-01-05T02:01:59.787Z'
        });
        setShowFormulario(false);
        mostrarMensajeToast("Estudiante Registrada");

        const nuevoDocumentoId = data.result.id;
        console.log(nuevoDocumentoId);

        const archivoFormData = new FormData();
        console.log(selectedFile);
        if (selectedFile) {
          archivoFormData.append("file", selectedFile);
          return fetch(`http://3.21.41.85/api/v1/archivo/${nuevoDocumentoId}`, {
            method: "POST",
            body: archivoFormData,
          });
        }
        return Promise.resolve(); // No hay archivo para subir, resolvemos la promesa
      })
      .then((archivoResponse) => {
        if (archivoResponse && !archivoResponse.ok) {
          throw new Error("Failed to upload file");
        }
        // Si todo fue exitoso o si no había archivo para subir, no hacemos nada adicional
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
        //mostrarMensajeToast("Error al Registrar");
      });
  };



  const handleDownload = (documentoId) => {
    fetch(`http://3.21.41.85/api/v1/archivo/${documentoId}`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Network response was not ok.');
      })
      .then((blob) => {
        // Crear un URL para el blob y crear un enlace para descargar
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `documento_${documentoId}.pdf`); // Nombre del archivo descargado
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
        mostrarMensajeToast('Error al descargar el archivo');
      });
  };



  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (selectedEstudiantes) {
      setSelectedEstudiantes((prevSelectedEstudiantes) => ({
        ...prevSelectedEstudiantes,
        [id]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const handleEdit = (documento) => {
    setSelectedEstudiantes(documento);
    setShowFormulario(true);
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
        <h1>Archivos</h1>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {/* Resto del contenido de la tabla */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th key="columna-cedula" scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th key="columna-nombre" scope="col" className="px-6 py-3">
                Descripción
              </th>
              <th key="columna-apellido" scope="col" className="px-6 py-3">
                Fecha
              </th>
              <th key="columna-acciones" scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((documentos) => (
              <tr
                key={documentos.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"

              >
                <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4" // Establecer el tamaño del icono aquí
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  {documentos.nombre}
                </td>
                <td className="px-6 py-4">{documentos.descripcion}</td>
                <td className="px-6 py-4">{documentos.fecha}</td>

                <td className="flex items-center px-6 py-4">
                  <a
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                    onClick={() => handleDelete(documentos.id)}
                  >
                    <DeleteIcon />
                  </a>
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => handleDownload(documentos.id)}
                  >
                    <DownloadIcon></DownloadIcon>
                  </a>

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

      <div className="fixed bottom-8 right-8 z-10">
        <button
          data-tooltip-target="tooltip-new"
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 font-medium colorbg rounded-full hover:bg-red-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleFormularioToggle} // Manejador de clic para abrir/cerrar el formulario
        >
          <svg
            className="w-4 h-4 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
          <span className="sr-only">New item</span>
        </button>
      </div>

      {showFormulario && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* ... */}
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
            onSubmit={handleInsert}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"

              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ingrese el nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Campos adicionales */}
            {/* Descripción */}
            {/* Fecha */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="descripcion"
              >
                Descripción
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="descripcion"
                name="descripcion"
                type="text"
                placeholder="Ingrese la descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="archivo"
              >
                Subir Archivo
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="archivo"
                name="archivo"
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>
            {/* Botones */}
            <div className="flex items-center justify-between">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleFormularioToggle}
              >
                Cerrar
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}

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
export default withAuth(archivosPage);