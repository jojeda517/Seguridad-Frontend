"use client";

import React, { useEffect, useState } from 'react';
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import '../facultades/styles.css';
import { Toast } from '@/components/toast';
import { withAuth } from "@/services/withAuth";

const facultadesPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [facultades, setFacultades] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showFormulario, setShowFormulario] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    id: '0',
    nombre: '',
    logo: '', // Cambiado a un objeto File
    sigla: '',
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedFacultad, setSelectedFacultad] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedFile, setSelectedFile] = useState(new File([], 'default.txt'));

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch('http://3.21.41.85/api/v1/facultad')
      .then((response) => response.json())
      .then((data) => setFacultades(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const totalPages = Math.ceil(facultades.length / itemsPerPage);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = facultades.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };





  const handleDelete = (id) => {
    fetch(`http://3.21.41.85/api/v1/facultad/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setFacultades((prevFacultades) =>
            prevFacultades.filter((facultad) => facultad.id !== id)
          );
          mostrarMensajeToast('Facultad eliminada');
        } else {
          throw new Error('Failed to delete');
        }
      })
      .catch((error) => console.error('Error deleting:', error));
    mostrarMensajeToast('Error al eliminar');
  };

  const handleFormularioToggle = () => {
    setShowFormulario((prevState) => !prevState); // Cambia el estado para mostrar u ocultar el formulario
    setSelectedFacultad(null); // Limpia el estado de selectedFacultad al abrir/cerrar el formulario
  };

  const handleInsert = (e) => {
    e.preventDefault();
  
    // Paso 1: Crear la facultad
    fetch('http://3.21.41.85/api/v1/facultad', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to register faculty');
      })
      .then((data) => {
        const nuevaFacultadId = data.result.id;
  
        // Paso 2: Subir el archivo de la facultad si hay un archivo seleccionado
        const archivoFormData = new FormData();
        if (selectedFile) {
          archivoFormData.append('file', selectedFile);
          return fetch(`http://3.21.41.85/api/v1/logo/${nuevaFacultadId}`, {
            method: 'POST',
            body: archivoFormData,
          });
        }
        return Promise.resolve(); // No hay archivo para subir, resolvemos la promesa
      })
      .then((archivoResponse) => {
        if (archivoResponse && !archivoResponse.ok) {
          throw new Error('Failed to upload faculty file');
        }
  
        // Paso 3: Actualizar el estado y mostrar el mensaje de éxito
        // Se puede mejorar asegurándote de que tienes la última versión de los datos antes de actualizar el estado
        fetch('http://3.21.41.85/api/v1/facultad')
          .then((response) => response.json())
          .then((data) => setFacultades(data))
          .catch((error) => console.error('Error fetching data:', error));
  
        setFormData({
          id: '0',
          nombre: '',
          logo: '',
          sigla: '',
        });
        setShowFormulario(false);
        mostrarMensajeToast('Facultad Registrada');
      })
      .catch((error) => {
        console.error('Error inserting faculty data:', error);
        //mostrarMensajeToast('Error al Registrar');
      });
  };
  
  
  

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (selectedFacultad) {
      setSelectedFacultad((prevSelectedFacultad) => ({
        ...prevSelectedFacultad,
        [id]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const handleEdit = (facultad) => {
    setSelectedFacultad(facultad);
    setShowFormulario(true);
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
  
    fetch(`http://3.21.41.85/api/v1/facultad/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedFacultad),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success' && data.result) {
          setFacultades((prevFacultades) =>
            prevFacultades.map((facultad) =>
              facultad.id === id ? { ...facultad, ...data.result } : facultad
            )
          );
          mostrarMensajeToast('Facultad actualizada');
        } else {
          console.error('Error en la edición:', data.message);
          mostrarMensajeToast('Error al editar');
        }
      })
      .catch((error) => console.error('Error updating data:', error))
      .finally(() => {
        setShowFormulario(false); // Cierra el formulario después de la edición
      });
  };

  
  
  
  // ... (resto del código)

  const [mostrarToast, setMostrarToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  const mostrarMensajeToast = (mensaje) => {
    setMensajeToast(mensaje);
    setMostrarToast(true);

    // Ocultar el toast después de cierto tiempo (por ejemplo, 5 segundos)
    setTimeout(() => {
      setMostrarToast(false);
    }, 5000);
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };
  








  return (
    <>

      <div className="text-center font-bold my-4 mb-8">
        <h1>Gestión Facultades</h1>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {/* Resto del contenido de la tabla */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th key="columna-nombre" scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th key="columna-logo" scope="col" className="px-6 py-3">
                Logo
              </th>
              <th key="columna-sigla" scope="col" className="px-6 py-3">
                Sigla
              </th>
              <th key="columna-acciones" scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((facultad) => (
              <tr key={facultad.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {facultad.nombre}
                </td>
                <td className="px-6 py-4">
                  {/* Mostrar la imagen del logo */}
                  {facultad.logo && <img src={`http://3.21.41.85/api/v1/logo/${facultad.id}`} alt="Logo de la facultad" className="w-16 h-16 object-cover rounded-full" />}
                </td>
                <td className="px-6 py-4">
                  {facultad.sigla}
                </td>
                <td className="flex items-center px-6 py-4 ">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => handleEdit(facultad)}
                  >
                    <EditIcon />
                  </a>
                  <a
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                    onClick={() => handleDelete(facultad.id)}
                  >
                    <DeleteIcon />
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
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : ''}`}
                onClick={() => handlePageChange(index + 1)}
                style={{ marginTop: '8px' }}
              >
                {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Toast></Toast>




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

          <div className="flex justify-center items-center h-screen">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
              onSubmit={handleInsert} // Agrega esta función al evento onSubmit del formulario
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
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logo')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  value={formData.sigla}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleFormularioToggle}
                >
                  Cerrar
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit" // Cambiado a type="submit" para activar la función handleSubmit
                >
                  Registrar Facultad
                </button>
              </div>
            </form>
          </div>
        </div>

      )}
      {showFormulario && selectedFacultad && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 w-full max-w-md"
            onSubmit={(e) => handleUpdate(e, selectedFacultad.id)}
          >
            <div className="mb-12">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Ingrese el nombre de la facultad"
                value={selectedFacultad ? selectedFacultad.nombre : ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="mb-12">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sigla">
                Sigla
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="sigla"
                type="text"
                placeholder="Ingrese la sigla de la facultad"
                value={selectedFacultad ? selectedFacultad.sigla : ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between mb-8">
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
                Actualizar Facultad
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
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
export default withAuth(facultadesPage);