// app/dashboard/page.tsx
"use client";

import Image from "next/image";
import '../dashboard/styles.css';
import { withAuth } from "../../services/withAuth";
import React, { useState, useEffect } from "react";

const DashboardPage = () => {
	const [userRole, setUserRole] = useState<string | null>(null);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);

	useEffect(() => {
		// Obtiene el rol, nombre y apellido del usuario desde el almacenamiento local
		const userRole = localStorage.getItem('userRole');
		const firstName = localStorage.getItem('firstName');
		const lastName = localStorage.getItem('lastName');

		// Actualiza los estados con la información del usuario
		setUserRole(userRole);
		setFirstName(firstName);
		setLastName(lastName);
	}, []);
	
	return (
		<>
			<div className=" justify-center items-center h-screen">
				<div className="text-center">
					<Image src="/logoUta.png" alt="username-icon" width={250} height={250} className="mx-auto" />
					<h1 className="text-2xl mt-4">Bienvenido/a {firstName} {lastName}</h1>
				</div>
			</div>

		</>
	);
}

// Utiliza withAuth para proteger la página y requerir autenticación
export default withAuth(DashboardPage);
