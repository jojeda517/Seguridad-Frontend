"use client";

import '../styles.css';
import { Toast } from '@/components/toast';
import React, { useEffect, useState } from 'react';
import { withAuth } from "@/services/withAuth";
import { EditIcon } from '../administradores/EditIcon';
import { DeleteIcon } from '../administradores/DeleteIcon';


const CategoriasPage = () => {

    // Datos
    const [carreras, setCarreras] = useState([]);
    const [facultades, setFacultades] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Estados
    const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
    const [facultadSeleccionada, setFacultadSeleccionada] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

    const [facultadPredeterminada, setFacultadPredeterminada] = useState('');

    const [carrerasFiltradas, setCarrerasFiltradas] = useState([]);

    // Paginación
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(categorias.length / itemsPerPage);
    const currentItems = categorias.slice(indexOfFirstItem, indexOfLastItem);

    // Formulario
    const [showFormulario, setShowFormulario] = useState(false);
    const [formData, setFormData] = useState({
        id: '0',
        nombre: '',
    });

    useEffect(() => {
        fetchCarrersData();
    }, []);


    const fetchCarrersData = async () => {
        try {
            const carrerResponse = await fetch('http://3.144.231.126/api/v1/carrera');
            if (!carrerResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const carrerData = await carrerResponse.json();
    
            // Obtener la facultad predeterminada (puedes cambiar esto según tu lógica)
            const defaultFaculty = carrerData[0].facultad_id;
    
            // Establecer la facultad predeterminada en el estado
            setFacultadPredeterminada(defaultFaculty);
    
            // Obtener IDs de facultades únicas
            const uniqueFacultyIds = [...new Set(carrerData.map((carrer) => carrer.facultad_id))];
    
            // Crear promesas para obtener datos de facultades
            const facultyDataFetches = uniqueFacultyIds.map(async (facultad_id) => {
                const facultyResponse = await fetch(`http://3.144.231.126/api/v1/facultad/${facultad_id}`);
    
                if (!facultyResponse.ok) {
                    throw new Error(`Failed to fetch role with ID ${facultad_id}`);
                }
    
                const facultyData = await facultyResponse.json();
                return { facultad_id, nombre: facultyData.nombre };
            });
    
            Promise.all(facultyDataFetches)
                .then((facultades) => {
                    const updatedCarreras = carrerData.map((carrer) => {
                        const faculty = facultades.find((faculty) => faculty.id === carrer.facultad_id);
                        return faculty ? { ...carrer, nombre: faculty.nombre } : carrer;
                    });
    
                    setCarreras(updatedCarreras);
    
                    // Obtener carreras filtradas para la facultad predeterminada
                    const filteredCarreras = updatedCarreras.filter(
                        (carrera) =>
                            parseInt(carrera.facultad_id, 10) === defaultFaculty ||
                            carrera.facultad_id === defaultFaculty.toString()
                    );
    
                    setCarrerasFiltradas(filteredCarreras);
                    setFacultadSeleccionada(defaultFaculty);
    
                    // Renderizar las categorías de la facultad predeterminada
                    fetchCategories(defaultFaculty);
    
                    // Puedes establecer la carrera predeterminada como la primera carrera
                    setCarreraSeleccionada(filteredCarreras[0]);
    
                    // Actualizar el estado de las facultades
                    setFacultades(facultades);
                })
                .catch((error) => {
                    console.error('Error fetching role data:', error);
                });
    
            fetchFaculties();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    

    const fetchCategories = async (carrera_id: any) => {
        try {
            const categotyResponse = await fetch(`http://3.144.231.126/api/v1/categorias/${carrera_id}`);
            if (!categotyResponse.ok) {
                throw new Error('Failed to fetch category data');
            }
            const categoryData = await categotyResponse.json();
            console.log("Categorias:", categoryData);
            setCategorias(categoryData);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };

    const fetchFaculties = async () => {
        try {
            const facultyResponse = await fetch('http://3.144.231.126/api/v1/facultad');
            if (!facultyResponse.ok) {
                throw new Error('Failed to fetch faculty data');
            }
            const facultyData = await facultyResponse.json();
            setFacultades(facultyData);
        } catch (error) {
            console.error('Error fetching faculty data:', error);
        }
    };

    // MANEJADORES DE EVENTOS

    // Obtener las carrers filtradas por la facultad seleccionada obteniendose su id
    const handleFacultadChange = (event: any) => {
        const facultadSeleccionadaID: any = parseInt(event.target.value, 10);
    
        const filteredCarreras = carreras.filter(
            (carrera: any) =>
                parseInt(carrera.facultad_id, 10) === facultadSeleccionadaID ||
                carrera.facultad_id === facultadSeleccionadaID.toString()
        );
        setFacultadSeleccionada(facultadSeleccionadaID);
        setCarrerasFiltradas(filteredCarreras);
    
        // Renderizar las categorias de una facultad seleccionada
        fetchCategories(filteredCarreras[0].id);
    
        // Actualizar la carrera seleccionada al cambiar de facultad
        setCarreraSeleccionada(filteredCarreras[0]);
    };
    
    
    
    

    const handleSelectCarreraChange = (event: any) => {
        const carreraSeleccionadaID = parseInt(event.target.value, 10);
    
        // Obtener la carrera seleccionada desde el estado
        const selectedCarrer: any = carreras.find((carrera) => carrera.id === carreraSeleccionadaID);
    
        // Actualizar el estado de la carrera seleccionada con la carrera seleccionada
        fetchCategories(carreraSeleccionadaID);
        setCarreraSeleccionada(selectedCarrer);
    
        // Actualizar el estado del formulario con la carrera seleccionada
        setFormData((prevFormData) => ({
            ...prevFormData,
            carrera_id: carreraSeleccionadaID,
        }));
    };
    
    

    // Eliminar Categoría
const handleDelete = (id: any, carrera_id: any) => {
    fetch(`http://3.144.231.126/api/v1/categoria/${id}/${carrera_id}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                // Filtrar las categorías excluyendo la categoría eliminada
                setCategorias((prevCategorias) =>
                    prevCategorias.filter((categoria) => categoria.id !== id)
                );
                mostrarMensajeToast('Categoría Eliminada!');
            } else {
                throw new Error('Failed to delete');
            }
        })
        .catch((error) => {
            console.error('Error deleting:', error);
            mostrarMensajeToast('Error al Eliminar');
        });
};


    // Registrar Categoría
    const handleSubmit = async (e: any) => {
        e.preventDefault();
    
        try {
            const carreraId = carreraSeleccionada ? carreraSeleccionada.id : carrerasFiltradas[0].id;
    
            console.log('Carrera ID:', carreraId);
    
            if (!carreraId) {
                console.error('No hay carreras disponibles para registrar la categoría.');
                return;
            }
    
            const response = await fetch(`http://3.144.231.126/api/v1/categoria/${carreraId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const dataResponse = await response.json();
    
            if (!response.ok) {
                throw new Error('Failed to register category');
            }
    
            console.log('Data Response:', dataResponse);
    
            fetchCategories(carreraId);
    
            setFormData({
                id: '0',
                nombre: '',
            });
    
            setShowFormulario(false);
            mostrarMensajeToast('¡Registro exitoso!');
        } catch (error) {
            console.error('Error al registrar categoría:', error);
            mostrarMensajeToast('Error al registrar');
        }
    };
    
    

    // Guardar una Categoria Mediante el Fomulario
    const handleEdit = (categoria: any) => {
        setCategoriaSeleccionada(categoria); // Guarda la categoria selecionada en el estado
        setShowFormulario(true); // Muestra el formulario para editar una carrera
    };

    // Actualizar Categoría
    const handleUpdate = async (e: any, id: any) => {
        e.preventDefault();
    
        try {
            // Realizar la solicitud PUT para actualizar la categoría
            
            const response = await fetch(`http://3.144.231.126/api/v1/categoria/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoriaSeleccionada), // Envía los datos actualizados del formulario
            });
    
            if (!response.ok) {
                throw new Error('Failed to update category');
            }
    
            // Realizar alguna acción adicional después de la actualización, si es necesario
            // Por ejemplo, puedes volver a cargar los datos de las categorías:
            fetchCategories(carreraSeleccionada.id);
    
            // Limpia el formulario después de una actualización exitosa
            setFormData({
                id: '0',
                nombre: '',
            });
    
            // Cerrar el formulario después de la actualización exitosa
            setShowFormulario(false);
            mostrarMensajeToast('Categoría Actualizada');
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            mostrarMensajeToast('Error al actualizar');
            // Manejar el error, mostrar un mensaje de error, etc.
        }
    };
    

    const handleFormularioToggle = () => {
        setShowFormulario((prevState) => !prevState); // Cambia el estado para mostrar u ocultar el formulario
        setCategoriaSeleccionada(''); // Limpia el estado de selectedCarrera al abrir/cerrar el formulario
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

    // MANEJO DEL FORMULARIO
    const handleInputChange = (event: any) => {
        // Extraer el id y el valor del elemento del formulario que ha cambiado
        const { id, value } = event.target;

        if (categoriaSeleccionada) {
            // Si hay una carrera seleccionada (modo edición)
            // Actualiza el estado de la carrera seleccionada con el nuevo valor del campo
            setCategoriaSeleccionada((prevCategoriaSeleccionada: any) => ({
                ...prevCategoriaSeleccionada,
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

    return (
        <>
            <div className="text-center font-bold my-4 mb-8">
                <h1>Gestor Categorías</h1>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facultad">
                        Seleccione una Facultad:
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="facultad"
                        //value={formData.facultad_id}
                        onChange={handleFacultadChange} // Agregar función para manejar el cambio de la facultad
                    >
                        {/* Opciones de facultades */}
                        {facultades.map((facultad) => (
                            <option key={facultad.id} value={facultad.id}>
                                {facultad.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carrera">
                        Seleccione una Carrera:
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="carrera"
                        // Usa la función que maneja el cambio de las carreras filtradas
                        onChange={handleSelectCarreraChange}>
                        {/* Opciones de carreras filtradas por la facultad seleccionada */}
                        {carrerasFiltradas.map((carrera) => (
                            <option key={carrera.id} value={carrera.id}>
                                {carrera.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((categoria) => (
                            <tr key={categoria.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {categoria.nombre}
                                </td>


                                <td className="flex items-center px-6 py-4">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={() => handleEdit(categoria)}>
                                        <EditIcon />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        onClick={() => handleDelete(categoria.id, carreraSeleccionada.id)}>
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
                                onSubmit={(e) => handleSubmit(e, carreraSeleccionada.id)}
                            /* onSubmit={handleSubmit} */
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                        Categoría:
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

                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={handleFormularioToggle}>
                                        Cerrar
                                    </button>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit">
                                        Registrar Categoría
                                    </button>
                                </div>
                            </form>
                        </div >
                    </div >
                )
            }

            {/* Formulario de Actualización de una Carrera */}
            {
                showFormulario && categoriaSeleccionada && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="flex justify-center items-center h-screen">

                            <form
                                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
                                onSubmit={(e) => handleUpdate(e, categoriaSeleccionada.id)}>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                        Categoria
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="nombre"
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        value={categoriaSeleccionada.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
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
                                        Actualizar Categoría
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
export default withAuth(CategoriasPage);