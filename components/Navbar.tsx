"use client";

import { User, Briefcase, Building2, Layers, Mail } from "lucide-react";
import { NavBar } from "./ui/tubelight-navbar";

const navItems = [
  { name: "About",      url: "#overview",   icon: User      },
  { name: "Projects",   url: "#projects",   icon: Briefcase },
  { name: "Experience", url: "#experience", icon: Building2 },
  { name: "Skills",     url: "#skills",     icon: Layers    },
  { name: "Contact",    url: "#contact",    icon: Mail      },
];

export default function Navbar() {
  return <NavBar items={navItems} />;
}
