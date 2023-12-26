import React from 'react';
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";

export default function AdministradoresPage() {
  return (
    <><div className="text-center font-bold my-4 mb-8">
    <h1>Gestión Administradores</h1>
  </div>
  
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="p-4">
                          
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Product name
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Color
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Category
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Accessories
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Available
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Price
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Weight
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Action
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="w-4 p-4">
                          
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          Apple MacBook Pro 17
                      </td>
                      <td className="px-6 py-4">
                          Silver
                      </td>
                      <td className="px-6 py-4">
                          Laptop
                      </td>
                      <td className="px-6 py-4">
                          Yes
                      </td>
                      <td className="px-6 py-4">
                          Yes
                      </td>
                      <td className="px-6 py-4">
                          $2999
                      </td>
                      <td className="px-6 py-4">
                          3.0 lb.
                      </td>
                      <td className="flex items-center px-6 py-4">
                          <a
                              href="#"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                              <EditIcon />
                          </a>
                          <a
                              href="#"
                              className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                          >
                              <DeleteIcon />
                          </a>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div></>
  );
}
