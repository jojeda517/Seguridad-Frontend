"use client";

import '../styles.css';
import { Toast } from '@/components/toast';
import React, { useEffect, useState } from 'react';
import { withAuth } from "@/services/withAuth";
import { EditIcon } from '../administradores/EditIcon';
import { DeleteIcon } from '../administradores/DeleteIcon';

const CarrerasPage = () => {

    // Datos
    const [facultades, setFacultades] = useState([]);
    const [carreras, setCarreras] = useState([]);

    // Estados
    const [selectedFacultad, setSelectedFacultad] = useState('');
    const [selectedCarrera, setSelectedCarrera] = useState('');

    // Estados para filtrar las carreras por facultad
    const [showFormulario, setShowFormulario] = useState(false);

    // Paginación
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(carreras.length / itemsPerPage);
    const currentItems = carreras.slice(indexOfFirstItem, indexOfLastItem);

    // Formulario
    const [formData, setFormData] = useState({
        id: '0',
        nombre: '',
        sigla: '',
        facultad_id: ''
    });


    // Obtener datos de la API
    const fetchCarrersData = async () => {
        try {
            const carrerResponse = await fetch('http://3.144.231.126/api/v1/carrera');
            if (!carrerResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const carrerData = await carrerResponse.json();
            setCarreras(carrerData);

            // Obtener IDs de facultades únicas
            const uniqueFacultyIds = [...new Set(carrerData.map((carrer) => carrer.facultad_id))];

            // Crear promesas para obtener datos de facultades
            const facultyDataFetches = uniqueFacultyIds.map(async (facultad_id) => {
                const facultyResponse = await fetch(`http://3.144.231.126/api/v1/facultad/${facultad_id}`);

                // Verificar si la respuesta fue exitosa
                if (!facultyResponse.ok) {
                    throw new Error(`Failed to fetch role with ID ${facultad_id}`);
                }

                // Convertir la respuesta a formato JSON
                const facultyData = await facultyResponse.json();

                // Retornar objeto con ID de la facultad y nombre del la facultad
                return { facultad_id, nombre: facultyData.nombre };
            });

            // Esperar a que todas las solicitudes de facultades se completen
            Promise.all(facultyDataFetches)
                .then((facultades) => {
                    // Actualizar usuarios con información del nombre del rol
                    const updatedCarreras = carrerData.map((carrer) => {
                        const faculty = facultades.find((faculty) => faculty.id === carrer.facultad_id);
                        return faculty ? { ...carrer, nombre: faculty.nombre } : carrer;
                    });

                    // Actualizar el estado o variable con las carreras actualizados
                    setCarreras(updatedCarreras);
                })
                .catch((error) => {
                    // Manejar errores durante la obtención de datos de roles
                    console.error('Error fetching role data:', error);
                });
            fetchFaculties();

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchFaculties = async () => {
        try {
            // 1. Realizar solicitud para obtener datos de facultades
            const response = await fetch('http://3.144.231.126/api/v1/facultad');

            // 2. Verificar si la respuesta fue exitosa
            if (response.ok) {
                // 3. Convertir la respuesta a formato JSON
                const data = await response.json();

                // 4. Actualizar el estado o variable con los datos de facultades
                setFacultades(data);

            } else {
                // 11. Lanzar un error si la respuesta no es exitosa
                throw new Error('Error fetching facultades');
            }
        } catch (error) {
            // 12. Manejar errores durante la obtención de datos de facultades
            console.error('Error fetching facultades:', error);
        }
    };

    useEffect(() => {
        fetchCarrersData();
    }, []);


    const handleInputChange = (event: any) => {
        // Extraer el id y el valor del elemento del formulario que ha cambiado
        const { id, value } = event.target;

        if (selectedCarrera) {
            // Si hay una carrera seleccionada (modo edición)
            // Actualiza el estado de la carrera seleccionada con el nuevo valor del campo
            setSelectedCarrera((prevSelectedCarrera) => ({
                ...prevSelectedCarrera,
                [id]: value,
            }));
        } else {
            // Si no hay una carrera seleccionada (modo creación)
            // Actualiza el estado del formulario con el nuevo valor del campo
            setFormData((prevFormData) => ({
                ...prevFormData,
                [id]: value,
            }));
        }
    };

    const handleSelectChange = (event: any) => {
        // 1. Obtener el valor seleccionado del elemento de selección
        const selectedFacultadId = parseInt(event.target.value, 10);

        // 3. Actualizar el formulario con el valor de carrera_id
        if (selectedCarrera) {
            // 4. Actualizar el estado del administrador seleccionado
            setSelectedFacultad((prevSelectedFacultad) => ({
                ...prevSelectedFacultad,
                facultad_id: selectedFacultadId,
            }));

        } else {
            // 5. Actualizar el estado del formulario
            setFormData((prevFormData) => ({
                ...prevFormData,
                facultad_id: selectedFacultadId,
            }));
        }
    };

    const handleFacultadUpdateChange = (event: any) => {
        // 1. Obtener el valor seleccionado del elemento de selección
        const selectedFacultadId = parseInt(event.target.value, 10);

        // 2. Actualizar el estado del administrador seleccionado con la nueva facultad_id
        setSelectedCarrera((prevSelectedCarrera) => ({
            ...prevSelectedCarrera,
            facultad_id: selectedFacultadId,
        }));
    };

    // Eliminar Carrera
    const handleDelete = (id: any) => {
        fetch(`http://3.144.231.126/api/v1/carrera/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setCarreras((prevCarreras) =>
                        prevCarreras.filter((carrera) => carrera.id !== id)
                    );
                    mostrarMensajeToast('¡Carrera Eliminada!');
                } else {
                    throw new Error('Failed to delete');
                }
            })
            .catch((error) => console.error('Error deleting:', error));
        mostrarMensajeToast('Error al Eliminar');
    };

    // Registrar Carrera
    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        console.log(formData);
        try {
            const response = await fetch('http://3.144.231.126/api/v1/carrera', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(formData), // Envía los datos del formulario
            });

            if (!response.ok) {
                throw new Error('Failed to register carrer');

            }

            // El administrador se ha registrado exitosamente
            // Puedes realizar alguna acción adicional aquí, como actualizar la lista de administradores, limpiar el formulario, etc.

            // Por ejemplo, después de registrar, podrías recargar la lista de administradores:
            fetchCarrersData();
            // Esta función debe ser definida para volver a cargar los datos después de registrar un nuevo administrador

            // Limpia el formulario después del registro exitoso
            setFormData({
                id: '0',
                nombre: '',
                sigla: '',
                facultad_id: ''
            });

            // Opción: puedes cerrar el formulario después del registro exitoso
            setShowFormulario(false);
            mostrarMensajeToast('¡Registro exitoso!');
        } catch (error) {
            console.error('Error al registrar administrador:', error);
            mostrarMensajeToast('Error al registrar');
            // Manejar el error, mostrar un mensaje de error, etc.
        }
    };

    // Guardar una Carrera Mediante el Fomulario
    const handleEdit = (carrera: any) => {
        setSelectedCarrera(carrera); // Guarda la carrera selecionada en el estado
        setShowFormulario(true); // Muestra el formulario para editar una carrera
    };

    // Actualizar Carrera
    const handleUpdate = async (e: any, id: any) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://3.144.231.126/api/v1/carrera/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedCarrera), // Envía los datos del formulario
            });

            if (!response.ok) {
                throw new Error('Failed to update administrator');
            }

            // Realizar alguna acción adicional después de la actualización, si es necesario

            // Por ejemplo, puedes volver a cargar los datos de los administradores:
            fetchCarrersData();

            // Cerrar el formulario después de la actualización exitosa
            setShowFormulario(false);
            mostrarMensajeToast('Carrera Actualizada');
        } catch (error) {
            console.error('Error al actualizar administrador:', error);
            mostrarMensajeToast('Error al actualizar');
            // Manejar el error, mostrar un mensaje de error, etc.
        }
    };

    const handleFormularioToggle = () => {
        setShowFormulario((prevState) => !prevState); // Cambia el estado para mostrar u ocultar el formulario
        // Si es la primera vez que se abre el formulario, establece facultad_id en el valor de la primera facultad
        if (!selectedCarrera && !showFormulario) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                facultad_id: facultades.length > 0 ? facultades[0].id : null,
            }));
        }
        setSelectedCarrera(''); // Limpia el estado de selectedFacultad al abrir/cerrar el formulario
    };

    // Metodo de la paginacion
    const handlePageChange = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };

    // Mensajes
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

    return (
        <><div className="text-center font-bold my-4 mb-8">
            <h1>Gestor Carreras</h1>
        </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Facultad
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Sigla
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((carrera) => (
                            <tr key={carrera.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {carrera.nombre}
                                </td>

                                <td className="px-6 py-4">
                                    {facultades.find((facultad) => facultad.id === carrera.facultad_id)?.nombre}
                                </td>
                                <td className="px-6 py-4">
                                    {carrera.sigla}
                                </td>
                                <td className="flex items-center px-6 py-4">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={() => handleEdit(carrera)}
                                    >
                                        <EditIcon />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        onClick={() => handleDelete(carrera.id)}
                                    >
                                        <DeleteIcon />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginador de la tabla */}
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

            <Toast></Toast>

            {/* Formulario de Ingreso de una Carrera */}
            {
                showFormulario && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="flex justify-center items-center h-screen">
                            <form
                                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
                                onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                        Nombre
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="nombre"
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facultad">
                                        Sigla
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="sigla"
                                        type="text"
                                        placeholder="Ingrese la Sigla"
                                        value={formData.sigla}
                                        onChange={handleInputChange}
                                        required>
                                    </input>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carrera">
                                        Facultad
                                    </label>

                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="facultad"
                                        value={formData.facultad_id}
                                        // Agregar función para manejar el cambio de la facultad seleccionada
                                        onChange={handleSelectChange}
                                        required>
                                        {/* Opciones de facultades */}
                                        {facultades.map((facultad) => (
                                            <option key={facultad.id} value={facultad.id}>
                                                {facultad.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={handleFormularioToggle}>
                                        Cerrar
                                    </button>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit">
                                        Registrar Carrera
                                    </button>
                                </div>
                            </form>
                        </div >
                    </div >
                )
            }

            {/* Formulario de Actualización de una Carrera */}
            {
                showFormulario && selectedCarrera && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="flex justify-center items-center h-screen">
                            <form
                                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
                                onSubmit={(e) => handleUpdate(e, selectedCarrera.id)}
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                        Carrera
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="nombre"
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        value={selectedCarrera.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sigla">
                                        Sigla
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="sigla"
                                        type="text"
                                        placeholder="Ingrese la Sigla"
                                        value={selectedCarrera.sigla}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facultad">
                                        Facultad
                                    </label>
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="facultad"
                                        value={selectedCarrera.facultad_id}
                                        onChange={handleFacultadUpdateChange}
                                    >
                                        {facultades.map((facultad) => (
                                            <option key={facultad.id} value={facultad.id}>
                                                {facultad.nombre}
                                            </option>
                                        ))}
                                    </select>
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
                                        type="submit"
                                    >
                                        Actualizar Carrera
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Toast */}
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
                )
            }
        </>
    );
}
export default withAuth(CarrerasPage);