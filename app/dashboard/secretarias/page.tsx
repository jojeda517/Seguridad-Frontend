"use client";
import '../styles.css';
import { Toast } from '@/components/toast';
import React, { useEffect, useState } from 'react';
import { EditIcon } from "@/app/dashboard/administradores/EditIcon";
import { DeleteIcon } from "@/app/dashboard/administradores/DeleteIcon";
import { withAuth } from "@/services/withAuth";
import CryptoJS from 'crypto-js';

const SecretariasPage = () => {
    const [administradores, setAdministradores] = useState([]);
    const [showFormulario, setShowFormulario] = useState(false);
    const [facultades, setFacultades] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [selectedFacultad, setSelectedFacultad] = useState('');
    const clave = 'unaclavesecreta12345';


    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 8;

    const totalPages = Math.ceil(administradores.length / itemsPerPage);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = administradores.slice(indexOfFirstItem, indexOfLastItem);

    const [selectedAdministrador, setSelectedAdministrador] = useState(null);

    const [formData, setFormData] = useState({
        id: '0',
        nombre: '',
        apellido: '',
        correo: '',
        rol_id: '2',
        contrasena: '',
        facultad_id: '',
        carrera_id: '',
    });

    const [filteredCarreras, setFilteredCarreras] = useState([]);
    const fetchUserData = async () => {
        try {
            // Cambiar la URL a la ruta correcta (2)
            const userDataResponse = await fetch('http://3.21.41.85/api/v1/usuario/rol/2');
            if (!userDataResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userDataResponse.json();
            setAdministradores(userData);

            const uniqueRoleIds = [...new Set(userData.map((user) => user.rol_id))];
            const roleDataFetches = uniqueRoleIds.map(async (roleId) => {
                const roleResponse = await fetch(`http://3.21.41.85/api/v1/rol/${roleId}`);
                if (!roleResponse.ok) {
                    throw new Error(`Failed to fetch role with ID ${roleId}`);
                }
                const roleData = await roleResponse.json();
                return { roleId, roleName: roleData.nombre };
            });

            Promise.all(roleDataFetches)
                .then((roles) => {
                    const updatedAdministradores = userData.map((user) => {
                        const role = roles.find((role) => role.roleId === user.rol_id);
                        return role
                            ? { ...user, nombre_rol: role.roleName }
                            : user;
                    });
                    setAdministradores(updatedAdministradores);
                })
                .catch((error) => {
                    console.error('Error fetching role data:', error);
                });

            fetchFacultades();
            fetchCarreras();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchCarreras = async () => {
        try {
            const response = await fetch('http://3.21.41.85/api/v1/carrera');
            if (response.ok) {
                const data = await response.json();
                setCarreras(data);

                // Si hay carreras disponibles, selecciona automáticamente la primera
                if (data.length > 0) {
                    const firstCarreraId = data[0].id;
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        carrera_id: firstCarreraId,
                    }));
                }
            } else {
                throw new Error('Error fetching carreras');
            }
        } catch (error) {
            console.error('Error fetching carreras:', error);
        }
    };


    const fetchFacultades = async () => {
        try {
            const response = await fetch('http://3.21.41.85/api/v1/facultad');
            if (response.ok) {
                const data = await response.json();
                setFacultades(data);

                // Si hay facultades disponibles, selecciona automáticamente la primera
                if (data.length > 0) {
                    const firstFacultadId = data[0].id;
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        facultad_id: firstFacultadId,
                    }));

                    // Carga las carreras para la primera facultad automáticamente
                    console.log(firstFacultadId);
                    const carrerasForFirstFacultad = await fetchCarrerasForFacultad(firstFacultadId);
                    console.log(carrerasForFirstFacultad);
                    setFilteredCarreras(carrerasForFirstFacultad);
                }
            } else {
                throw new Error('Error fetching facultades');
            }
        } catch (error) {
            console.error('Error fetching facultades:', error);
        }
    };
    const fetchCarrerasForFacultad = async (facultadId) => {
        try {
            const response = await fetch(`http://3.21.41.85/api/v1/carrera/facultad/${facultadId}`);
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Error fetching carreras for facultad');
            }
        } catch (error) {
            console.error('Error fetching carreras for facultad:', error);
            return [];
        }
    };


    useEffect(() => {

        fetchUserData();
    }, []);
    // Agregar administrador

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (selectedAdministrador) {
            setSelectedAdministrador((prevSelectedAdministrador) => ({
                ...prevSelectedAdministrador,
                [id]: value,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [id]: value,
            }));
        }
    };




    const handleFormularioToggle = () => {
        setShowFormulario((prevState) => !prevState); // Cambia el estado para mostrar u ocultar el formulario
        setSelectedAdministrador(null); // Limpia el estado de selectedFacultad al abrir/cerrar el formulario
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = (id) => {
        fetch(`http://3.21.41.85/api/v1/usuario/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setAdministradores((prevAdministradores) =>
                        prevAdministradores.filter((administrador) => administrador.id !== id)
                    );
                    //mostrarMensajeToast('Administrador Eliminado');
                    mostrarMensajeToast('Administrador Eliminado');
                } else {
                    throw new Error('Failed to delete');
                }
            })
            .catch((error) => console.error('Error deleting:', error));
        mostrarMensajeToast('Error al Eliminar');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Encripta la contraseña utilizando AES y una clave secreta (puedes cambiar la clave según tus necesidades)
        const encryptedPassword = CryptoJS.AES.encrypt(formData.contrasena, clave).toString();
      
        try {
          const response = await fetch('http://3.21.41.85/api/v1/usuario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              contrasena: encryptedPassword,
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to register administrator');
          }
          fetchUserData();
          setFormData({
            id: '0',
            nombre: '',
            apellido: '',
            correo: '',
            rol_id: '1',
            contrasena: '',
            facultad_id: '',
            carrera_id: '',
          });
      
          // Cierra el formulario después de la inserción exitosa
          setShowFormulario(false);
          // Resto del código
          mostrarMensajeToast('!!Secretario registrado');
        } catch (error) {
          console.error('Error al registrar administrador:', error);
          mostrarMensajeToast('Error al registrar');
          // Manejar el error, mostrar un mensaje de error, etc.
        }
      };


    const handleSelectChange = (event) => {
        const selectedCarreraId = parseInt(event.target.value, 10);
        console.log(selectedCarreraId);

        // Actualiza el formulario con el valor de carrera_id
        if (selectedAdministrador) {
            setSelectedAdministrador((prevSelectedAdministrador) => ({
                ...prevSelectedAdministrador,
                carrera_id: selectedCarreraId,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                carrera_id: selectedCarreraId,
            }));
        }
    };

    const handleFacultadChange = (event) => {
        const selectedFacultadId = parseInt(event.target.value, 10);
        setSelectedFacultad(selectedFacultadId); // Actualiza la facultad seleccionada

        setFormData({ ...formData, facultad_id: selectedFacultadId });

        const filteredCarreras = carreras.filter(
            (carrera) =>
                parseInt(carrera.facultad_id, 10) === selectedFacultadId ||
                carrera.facultad_id === selectedFacultadId.toString()
        );
        setFilteredCarreras(filteredCarreras);
    };



    const handleEdit = (administrador) => {
        // Descifrar la contraseña antes de mostrarla en el formulario
        const decryptedPassword = CryptoJS.AES.decrypt(administrador.contrasena, clave).toString(CryptoJS.enc.Utf8);
      
        setSelectedAdministrador({
          ...administrador,
          contrasena: decryptedPassword,
        });
        setShowFormulario(true);
        // Resto del código...
      };


      const handleUpdate = async (e, adminId) => {
        e.preventDefault();
      
        // Cifrar la contraseña antes de enviarla para la actualización
        const encryptedPassword = CryptoJS.AES.encrypt(selectedAdministrador.contrasena, clave).toString();
      
        try {
          const response = await fetch(`http://3.21.41.85/api/v1/usuario/${adminId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...selectedAdministrador,
              contrasena: encryptedPassword,
            }),
          });
      
            fetchUserData();

            // Cerrar el formulario después de la actualización exitosa
            setShowFormulario(false);
            mostrarMensajeToast('Administrador Actualizado');
        } catch (error) {
          console.error('Error al actualizar administrador:', error);
          mostrarMensajeToast('Error al actualizar');
          // Manejar el error, mostrar un mensaje de error, etc.
        }
      };

      
    

    const handleFacultadUpdateChange = (event) => {
        const selectedFacultadId = parseInt(event.target.value, 10);
        setSelectedAdministrador((prevSelectedAdministrador) => ({
            ...prevSelectedAdministrador,
            facultad_id: selectedFacultadId,
        }));

        const filteredCarreras = carreras.filter(
            (carrera) =>
                parseInt(carrera.facultad_id, 10) === selectedFacultadId ||
                carrera.facultad_id === selectedFacultadId.toString()
        );
        setFilteredCarreras(filteredCarreras);
    };

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



    return (
        <><div className="text-center font-bold my-4 mb-8">
            <h1>Gestor Secretarios/as</h1>
        </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Apellido
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Correo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Rol
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Facultad
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Carrera
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((administrador) => (
                            <tr key={administrador.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {administrador.nombre}
                                </td>
                                <td className="px-6 py-4">
                                    {administrador.apellido}
                                </td>
                                <td className="px-6 py-4">
                                    {administrador.correo}
                                </td>
                                <td className="px-6 py-4">
                                    {administrador.nombre_rol || 'Cargando...'}
                                </td>
                                <td className="px-6 py-4">
                                    {facultades.find((facultad) => facultad.id === administrador.facultad_id)?.nombre}
                                </td>
                                <td className="px-6 py-4">
                                    {carreras.find((carrera) => carrera.id === administrador.carrera_id)?.nombre}
                                </td>
                                <td className="flex items-center px-6 py-4">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={() => handleEdit(administrador)}
                                    >
                                        <EditIcon />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        onClick={() => handleDelete(administrador.id)}
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

            {showFormulario && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="flex justify-center items-center h-screen">
                        <form
                            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
                            onSubmit={handleSubmit} // Asegúrate de tener una función handleSubmit para manejar el envío del formulario
                        >
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Ingrese el apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
                                    Correo
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="correo"
                                    type="email"
                                    placeholder="Ingrese el correo"
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contrasena">
                                    Contraseña
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="contrasena"
                                    type="password"
                                    placeholder="Ingrese la contraseña"
                                    value={formData.contrasena}
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
                                    value={formData.facultad_id}
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
                                    Carrera
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="carrera"
                                    value={formData.carrera_id}
                                    onChange={handleSelectChange} // Usa la función que maneja el cambio de las carreras filtradas
                                >
                                    {/* Opciones de carreras filtradas por la facultad seleccionada */}
                                    {filteredCarreras.map((carrera) => (
                                        <option key={carrera.id} value={carrera.id}>
                                            {carrera.nombre}
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
                                    Registrar Administrador
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showFormulario && selectedAdministrador && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="flex justify-center items-center h-screen">
                        <form
                            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
                            onSubmit={(e) => handleUpdate(e, selectedAdministrador.id)}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Ingrese el nombre"
                                    value={selectedAdministrador.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Ingrese el apellido"
                                    value={selectedAdministrador.apellido}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
                                    Correo
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="correo"
                                    type="email"
                                    placeholder="Ingrese el correo"
                                    value={selectedAdministrador.correo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contrasena">
                                    Contraseña
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="contrasena"
                                    type="password"
                                    placeholder="Ingrese la contraseña"
                                    value={selectedAdministrador.contrasena}
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
                                    value={selectedAdministrador.facultad_id}
                                    onChange={handleFacultadUpdateChange}
                                >
                                    {facultades.map((facultad) => (
                                        <option key={facultad.id} value={facultad.id}>
                                            {facultad.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carrera">
                                    Carrera
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="carrera"
                                    value={selectedAdministrador.carrera_id}
                                    onChange={handleSelectChange}
                                >
                                    {filteredCarreras.map((carrera) => (
                                        <option key={carrera.id} value={carrera.id}>
                                            {carrera.nombre}
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
                                    Actualizar Administrador
                                </button>
                            </div>
                        </form>
                    </div>
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
    );
}
export default withAuth(SecretariasPage);