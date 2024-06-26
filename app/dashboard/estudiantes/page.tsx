"use client";

import React, { useEffect, useState } from "react";
import { EditIcon } from "../administradores/EditIcon";
import { DeleteIcon } from "../administradores/DeleteIcon";

import CryptoJS from 'crypto-js';
import "../facultades/styles.css";


export default function estudiantesPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [estudiantes, setEstudiantes] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showFormulario, setShowFormulario] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [carreras, setCarreras] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userCarrera, setUserCarrera] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showFileUploadForm, setShowFileUploadForm] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedFile, setSelectedFile] = useState(new File([], 'default.txt'));
  const clave = 'unaclavesecreta12345';


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
        console.log(carrera_id);
        setUserCarrera(carrera_id);
  
        const estudiantesResponse = await fetch(
          `http://3.144.231.126/api/v1/estudiantes/${carrera_id}`
        );
  
        if (estudiantesResponse.ok) {
          const estudiantesData = await estudiantesResponse.json();
  
          //console.log(estudiantesData.cedula);
  
          const estudiantesDesencriptados = estudiantesData.map((estudiante) => {
            const {
              id,
              apellido,
              cedula,
              celular,
              correo,
              direccion,
              nombre,
              // ... otros campos encriptados que necesites desencriptar
            } = estudiante;
  
            if (cedula.length <= 10) {
              // Encriptar la información del estudiante si la longitud de la cédula es menor o igual a 10
              const campoEncriptado_1 = CryptoJS.AES.encrypt(apellido, clave).toString();
              const campoEncriptado_2 = CryptoJS.AES.encrypt(cedula, clave).toString();
              const campoEncriptado_3 = CryptoJS.AES.encrypt(celular, clave).toString();
              const campoEncriptado_4 = CryptoJS.AES.encrypt(correo, clave).toString();
              const campoEncriptado_5 = CryptoJS.AES.encrypt(direccion, clave).toString();
              const campoEncriptado_6 = CryptoJS.AES.encrypt(nombre, clave).toString();
  
              // ... encriptar otros campos según sea necesario
  
              // Enviar la solicitud PUT con los datos encriptados
              fetch(`http://3.144.231.126/api/v1/estudiante/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  apellido: campoEncriptado_1,
                  cedula: campoEncriptado_2,
                  celular: campoEncriptado_3,
                  correo: campoEncriptado_4,
                  direccion: campoEncriptado_5,
                  nombre: campoEncriptado_6,
                  id:id,
                  // ... otros campos encriptados que necesites enviar
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  // Procesar la respuesta si es necesario
                  const decryptedUpdatedData = {
                    ...data.result,
                    nombre: CryptoJS.AES.decrypt(data.result.nombre, clave).toString(CryptoJS.enc.Utf8),
                    apellido: CryptoJS.AES.decrypt(data.result.apellido, clave).toString(CryptoJS.enc.Utf8),
                    cedula: CryptoJS.AES.decrypt(data.result.cedula, clave).toString(CryptoJS.enc.Utf8),
                    correo: CryptoJS.AES.decrypt(data.result.correo, clave).toString(CryptoJS.enc.Utf8),
                    direccion: CryptoJS.AES.decrypt(data.result.direccion, clave).toString(CryptoJS.enc.Utf8),
                    celular: CryptoJS.AES.decrypt(data.result.celular, clave).toString(CryptoJS.enc.Utf8),
                  };
          
                  // Update the estudiantes state with the decrypted data
                  setEstudiantes((prevEstudiantes) =>
                    prevEstudiantes.map((estudiante) =>
                      estudiante.id === id ? decryptedUpdatedData : estudiante
                    )
                  );
                  console.log("Datos actualizados:", data);
                })
                .catch((error) => console.error("Error al actualizar datos:", error));
            } else {
              // Desencriptar la información del estudiante si la longitud de la cédula es mayor a 10
              const campoDesencriptado_1 = CryptoJS.AES.decrypt(apellido, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_2 = CryptoJS.AES.decrypt(cedula, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_3 = CryptoJS.AES.decrypt(celular, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_4 = CryptoJS.AES.decrypt(correo, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_5 = CryptoJS.AES.decrypt(direccion, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_6 = CryptoJS.AES.decrypt(nombre, clave).toString(CryptoJS.enc.Utf8);
  
              // ... desencriptar otros campos según sea necesario
  
              return {
                ...estudiante,
                apellido: campoDesencriptado_1,
                cedula: campoDesencriptado_2,
                celular: campoDesencriptado_3,
                correo: campoDesencriptado_4,
                direccion: campoDesencriptado_5,
                nombre: campoDesencriptado_6,
                // ... asignar los otros campos desencriptados a las propiedades correspondientes
              };
            }
          }).filter(Boolean);

          const estudiantesResponseNueva = await fetch(
            `http://3.144.231.126/api/v1/estudiantes/${carrera_id}`
          );
          
          if (estudiantesResponseNueva.ok) {
            const estudiantesDataNueva = await estudiantesResponseNueva.json();
          
            const estudiantesDesencriptadosNueva = estudiantesDataNueva.map((estudiante) => {
              const {
                id,
                apellido,
                cedula,
                celular,
                correo,
                direccion,
                nombre,
                // ... otros campos encriptados que necesites desencriptar
              } = estudiante;
          
              // Desencriptar la información del estudiante
              const campoDesencriptado_1 = CryptoJS.AES.decrypt(apellido, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_2 = CryptoJS.AES.decrypt(cedula, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_3 = CryptoJS.AES.decrypt(celular, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_4 = CryptoJS.AES.decrypt(correo, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_5 = CryptoJS.AES.decrypt(direccion, clave).toString(CryptoJS.enc.Utf8);
              const campoDesencriptado_6 = CryptoJS.AES.decrypt(nombre, clave).toString(CryptoJS.enc.Utf8);
          
              return {
                ...estudiante,
                apellido: campoDesencriptado_1,
                cedula: campoDesencriptado_2,
                celular: campoDesencriptado_3,
                correo: campoDesencriptado_4,
                direccion: campoDesencriptado_5,
                nombre: campoDesencriptado_6,
                // ... asignar los otros campos desencriptados a las propiedades correspondientes
              };
            });
          
            setEstudiantes(estudiantesDesencriptadosNueva);
          } else {
            throw new Error("Error fetching estudiantes");
          }
  
          //console.log(estudiantesDesencriptados);
          //setEstudiantes(estudiantesDesencriptados);
          //console.log(estudiantes);
  
          // Resto del código para carreras...
  
        } else {
          throw new Error("Error fetching estudiantes");
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

  const totalPages = Math.ceil(estudiantes.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = estudiantes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFileUploadFormToggle = () => {
    setShowFileUploadForm((prevState) => !prevState);
  };
  

  const handleDelete = (id) => {
    fetch(
      `http://3.144.231.126/api/v1/estudiante/${id}/${parseFloat(userCarrera)}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          setEstudiantes((prevEstudiantes) =>
            prevEstudiantes.filter((estudiante) => estudiante.id !== id)
          );
          mostrarMensajeToast("Estudiante eliminada");
        } else {
          throw new Error("Failed to delete");
        }
      })
      .catch((error) => console.error("Error deleting:", error));
    mostrarMensajeToast("Error al eliminar");
  };

  const handleFormularioToggle = () => {
    setShowFormulario((prevState) => !prevState); // Cambia el estado para mostrar u ocultar el formulario
    setSelectedEstudiantes(null); // Limpia el estado de selectedFacultad al abrir/cerrar el formulario
  };

  const handleInsert = (e) => {
    e.preventDefault();
  
    // Encriptar los campos necesarios con CryptoJS
    const encryptedFormData = {
      id: formData.id,
      nombre: CryptoJS.AES.encrypt(formData.nombre, clave).toString(),
      apellido: CryptoJS.AES.encrypt(formData.apellido, clave).toString(),
      cedula: CryptoJS.AES.encrypt(formData.cedula, clave).toString(),
      correo: CryptoJS.AES.encrypt(formData.correo, clave).toString(),
      direccion: CryptoJS.AES.encrypt(formData.direccion, clave).toString(),
      celular: CryptoJS.AES.encrypt(formData.celular, clave).toString(),
    };
  
    fetch(`http://3.144.231.126/api/v1/estudiante/${userCarrera}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        const decryptedUpdatedData = {
          ...data.result,
          nombre: CryptoJS.AES.decrypt(data.result.nombre, clave).toString(CryptoJS.enc.Utf8),
          apellido: CryptoJS.AES.decrypt(data.result.apellido, clave).toString(CryptoJS.enc.Utf8),
          cedula: CryptoJS.AES.decrypt(data.result.cedula, clave).toString(CryptoJS.enc.Utf8),
          correo: CryptoJS.AES.decrypt(data.result.correo, clave).toString(CryptoJS.enc.Utf8),
          direccion: CryptoJS.AES.decrypt(data.result.direccion, clave).toString(CryptoJS.enc.Utf8),
          celular: CryptoJS.AES.decrypt(data.result.celular, clave).toString(CryptoJS.enc.Utf8),
        };

        // Update the estudiantes state with the decrypted data
        setEstudiantes((prevEstudiantes) => [...prevEstudiantes, decryptedUpdatedData]);
        setFormData({
          id: "0",
          nombre: "",
          apellido: "",
          cedula: "",
          correo: "",
          direccion: "",
          celular: "",
        });
        setShowFormulario(false);
        mostrarMensajeToast("Estudiante Registrada");
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
        mostrarMensajeToast("Error al Registrar");
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

  const handleEdit = (estudiante) => {
    setSelectedEstudiantes(estudiante);
    setShowFormulario(true);
  };

  const handleCarpetas = (id) => {
    window.location.href = `/dashboard/estudiantes/carpetasEstudiantes`;
    localStorage.setItem("StudentId", id);
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
  
    // Encrypt the fields before sending the update request
    const encryptedUpdateData = {
      ...selectedEstudiantes,
      nombre: CryptoJS.AES.encrypt(selectedEstudiantes.nombre, clave).toString(),
      apellido: CryptoJS.AES.encrypt(selectedEstudiantes.apellido, clave).toString(),
      cedula: CryptoJS.AES.encrypt(selectedEstudiantes.cedula, clave).toString(),
      correo: CryptoJS.AES.encrypt(selectedEstudiantes.correo, clave).toString(),
      direccion: CryptoJS.AES.encrypt(selectedEstudiantes.direccion, clave).toString(),
      celular: CryptoJS.AES.encrypt(selectedEstudiantes.celular, clave).toString(),
    };
  
    fetch(`http://3.144.231.126/api/v1/estudiante/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedUpdateData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && data.result) {
          // Decrypt the updated data
          const decryptedUpdatedData = {
            ...data.result,
            nombre: CryptoJS.AES.decrypt(data.result.nombre, clave).toString(CryptoJS.enc.Utf8),
            apellido: CryptoJS.AES.decrypt(data.result.apellido, clave).toString(CryptoJS.enc.Utf8),
            cedula: CryptoJS.AES.decrypt(data.result.cedula, clave).toString(CryptoJS.enc.Utf8),
            correo: CryptoJS.AES.decrypt(data.result.correo, clave).toString(CryptoJS.enc.Utf8),
            direccion: CryptoJS.AES.decrypt(data.result.direccion, clave).toString(CryptoJS.enc.Utf8),
            celular: CryptoJS.AES.decrypt(data.result.celular, clave).toString(CryptoJS.enc.Utf8),
          };
  
          // Update the estudiantes state with the decrypted data
          setEstudiantes((prevEstudiantes) =>
            prevEstudiantes.map((estudiante) =>
              estudiante.id === id ? decryptedUpdatedData : estudiante
            )
          );
  
          mostrarMensajeToast("Estudiante actualizado");
        } else {
          console.error("Error en la edición:", data.message);
          mostrarMensajeToast("Error al editar");
        }
      })
      .catch((error) => console.error("Error updating data:", error))
      .finally(() => {
        setShowFormulario(false); // Close the form after editing
      });
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

  const handleTelefonoChange = (e) => {
    const input = e.target.value;
    const regex = /^[0-9]*$/;

    // Expresión regular para números

    if (regex.test(input) || input === "") {
      setFormData({
        ...formData,
        celular: input,
      });
    }
  };

  const handleTelefonoChangeEditForm = (e) => {
    const input = e.target.value;
    const regex = /^[0-9]*$/;

    if (regex.test(input) || input === "") {
      setSelectedEstudiantes((prevSelectedEstudiantes) => ({
        ...prevSelectedEstudiantes,
        celular: input,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado del evento
  
    // Aquí puedes realizar acciones con el archivo seleccionado, como establecerlo en el estado
    // Por ejemplo, podrías guardar el archivo en el estado si usas un hook de estado:
    setSelectedFile(file);
  };

  const handleFileSubmit = async () => {
    if (!selectedFile) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    }
  
    const archivoformData = new FormData();
    archivoformData.append("file", selectedFile);
  
    try {
      
      const response = await fetch(`http://3.144.231.126/api/v1/cargar-estudiantes/${userCarrera}`, {
        method: "POST",
        body: archivoformData,
      });
  
      if (response.ok) {
        // Procesar la respuesta si es necesario
        console.log("Archivo cargado exitosamente.");
      } else {
        throw new Error("Error al cargar el archivo.");
      }
    } catch (error) {
      console.error("Error al realizar la carga del archivo:", error);
    }
  };
  
  

  return (
    <>
      <div className="text-center font-bold my-4 mb-8">
        <h1>Gestor Estudiantes</h1>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {/* Resto del contenido de la tabla */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th key="columna-cedula" scope="col" className="px-6 py-3">
                Cédula
              </th>
              <th key="columna-nombre" scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th key="columna-apellido" scope="col" className="px-6 py-3">
                Apellido
              </th>
              <th key="columna-correo" scope="col" className="px-6 py-3">
                Correo
              </th>
              <th key="columna-direccion" scope="col" className="px-6 py-3">
                Dirección
              </th>
              <th key="columna-telefono" scope="col" className="px-6 py-3">
                Teléfono
              </th>
              <th key="columna-acciones" scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((estudiantes) => (
              <tr
                key={estudiantes.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => handleCarpetas(estudiantes.id)}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {estudiantes.cedula}
                </td>
                <td className="px-6 py-4">{estudiantes.nombre}</td>
                <td className="px-6 py-4">{estudiantes.apellido}</td>
                <td className="px-6 py-4">{estudiantes.correo}</td>
                <td className="px-6 py-4">{estudiantes.direccion}</td>
                <td className="px-6 py-4">{estudiantes.celular}</td>
                <td className="flex items-center px-6 py-4">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar la propagación del evento
                      handleEdit(estudiantes);
                    }}
                  >
                    <EditIcon />
                  </button>
                  <a
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar la propagación del evento
                      handleDelete(estudiantes.id);
                    }}
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
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                  currentPage === index + 1
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

      <div className="fixed bottom-16 right-8 z-10">
        <button
          data-tooltip-target="tooltip-new"
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 font-medium secondcolorbg rounded-full hover:bg-sky-800 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleFileUploadFormToggle} // Manejador de clic para abrir/cerrar el formulario
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 colortext"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>

          <span className="sr-only">uploadEstudiantes</span>
        </button>
      </div>

      <div className="fixed bottom-5 right-8 z-10">
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
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="cedula"
                >
                  Cédula
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="cedula"
                  type="text"
                  placeholder="Ingrese la cédula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apellido"
                >
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
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="correo"
                >
                  Correo
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="correo"
                  type="text"
                  placeholder="Ingrese el correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="direccion"
                >
                  Dirección
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="direccion"
                  type="text"
                  placeholder="Ingrese la dirección"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="telefono"
                >
                  Teléfono
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="telefono"
                  type="text"
                  placeholder="Ingrese el teléfono"
                  value={formData.celular}
                  onChange={handleTelefonoChange}
                  required
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
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFormulario && selectedEstudiantes && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
            onSubmit={(e) => handleUpdate(e, selectedEstudiantes.id)}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="cedula"
              >
                Cédula
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cedula"
                type="text"
                placeholder="Cédula"
                value={selectedEstudiantes ? selectedEstudiantes.cedula : ""}
                onChange={handleInputChange}
                required
              />
            </div>
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
                type="text"
                placeholder="Nombre"
                value={selectedEstudiantes ? selectedEstudiantes.nombre : ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Apellido
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="apellido"
                type="text"
                placeholder="Apellido"
                value={selectedEstudiantes ? selectedEstudiantes.apellido : ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="correo"
              >
                Correo
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="correo"
                type="text"
                placeholder="Correo"
                value={selectedEstudiantes ? selectedEstudiantes.correo : ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="direccion"
              >
                Dirección
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="direccion"
                type="text"
                placeholder="Dirección"
                value={selectedEstudiantes ? selectedEstudiantes.direccion : ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="telefono"
              >
                Teléfono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="telefono"
                type="text"
                placeholder="Teléfono"
                value={selectedEstudiantes ? selectedEstudiantes.celular : ""}
                onChange={handleTelefonoChangeEditForm}
                required
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
                type="submit"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      )}

{showFileUploadForm && (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        onSubmit={handleFileSubmit} // Aquí irá la función para manejar el envío del archivo
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fileUpload"
          >
            Subir archivo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fileUpload"
            type="file"
            onChange={handleFileChange} // Aquí irá la función para manejar el cambio en el archivo seleccionado
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleFileUploadFormToggle}
          >
            Cerrar
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Subir
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
