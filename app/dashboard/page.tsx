// app/dashboard/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "./layout";
import '../dashboard/styles.css';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState(0);

  useEffect(() => {
    // Obtén el rol del localStorage u otro lugar
    const storedUserRole = parseInt(localStorage.getItem('userRole') || '0', 10);
    setUserRole(storedUserRole);
  }, []);


  return (
    <DashboardLayout userRole={userRole}>
      <div>
        <p>dashboard</p>
      </div>
    </DashboardLayout>
  );
}
