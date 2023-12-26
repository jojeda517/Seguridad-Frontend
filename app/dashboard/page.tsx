"use client";
import React, { useState } from "react";
//import { useClient } from "next/client";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import '../dashboard/styles.css';

export default function dashboardPage() {
  //useClient();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <div >
      <p>dashboard</p>
    </div>
  );
}
