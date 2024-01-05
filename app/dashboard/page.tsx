// app/dashboard/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "./layout";
import Image from "next/image";
import '../dashboard/styles.css';

export default function DashboardPage() {
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
  <div className=" justify-center items-center h-screen">
    <div className="text-center">
      <Image src="/logoUta.png" alt="username-icon" width={250} height={250} className="mx-auto" />
      <h1 className="text-2xl mt-4">Bienvenido al sistema {firstName} {lastName}</h1>
    </div>
  </div>
</>

  
      

  );
}
