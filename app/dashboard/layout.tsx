"use client";
import Link from "next/link";
import { useState, useEffect } from "react";


export default function dashboardLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const [userRole, setUserRole] = useState<string | null>(null);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);

	useEffect(() => {
		const role = localStorage.getItem('userRole');
		const firstName = localStorage.getItem('firstName');
		const lastName = localStorage.getItem('lastName');
		setUserRole(role);
		setFirstName(firstName);
		setLastName(lastName);
	}, []);

	return (
		<>
			<aside
				id="default-sidebar"
				className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
				aria-label="Sidebar"
			>
				<div className="h-full px-3 py-4 overflow-y-auto colorbg dark:bg-gray-800">
					<ul className="space-y-2 font-medium">
						<ul>
							{userRole === '1' && (
								<li key="admin">
									{/* Aquí puedes poner el código para mostrar el elemento del menú para el rol de admin */}
									<Link href="/dashboard"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
										</svg>

										<span className="flex-1 ms-3 whitespace-nowrap">Inicio</span>
									</Link>
									<Link href="/dashboard/secretarias"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
										</svg>

										<span className="flex-1 ms-3 whitespace-nowrap">Secretarios/as</span>
									</Link>

									<Link href="/dashboard/carreras"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
										</svg>

										<span className="flex-1 ms-3 whitespace-nowrap">Carreras</span>
									</Link>
									<Link href="/dashboard/categorias"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">

										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
										</svg>

										<span className="flex-1 ms-3 whitespace-nowrap">Categorías</span>
									</Link>
								</li>

							)}
							{userRole === '2' && (

								<li key="secretario">

									<Link href="/dashboard"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
										</svg>
										<span className="flex-1 ms-3 whitespace-nowrap">Inicio</span>
									</Link>
									<Link href="/dashboard/estudiantes"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
										</svg>

										<span className="flex-1 ms-3 whitespace-nowrap">Estudiantes</span>
									</Link>
								</li>


							)}
							{userRole === '3' && (
								<li key="superadmin">

									<Link href="/dashboard"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
										</svg>
										<span className="flex-1 ms-3 whitespace-nowrap">Inicio</span>
									</Link>
									<Link href="/dashboard/administradores"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
										</svg>
										<span className="flex-1 ms-3 whitespace-nowrap">Administradores</span>
									</Link>
									<Link href="/dashboard/facultades"
										className="flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
										</svg>

										<span className="flex-1 ms-3 whitespace-nowrap">Facultades</span>
									</Link>
								</li>
							)}
							<li key="salir">
								<Link href="/" className="{isRouteActive('/') ? 'active' : ''}
									flex items-center p-2 colortext rounded-lg dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700 group">
									<svg className="w-5 h-5 colortext transition duration-75 dark:text-gray-400 group-hover:text-gray-100 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
									</svg>
									<span className="flex-1 ms-3 whitespace-nowrap">Salir</span>
								</Link>
							</li>
						</ul>
						{/* {children}  */}
					</ul>
				</div>
			</aside >
			<div className="p-4 sm:ml-64">{children}</div>

		</>
	);
}