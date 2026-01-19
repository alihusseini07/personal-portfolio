import "./globals.css";
import type { Metadata } from "next";
import Magnetic from "../components/Magnetic";

export const metadata: Metadata = {
title: "Ali | Portfolio",
description: "Personal portfolio of projects by Ali Husseini.",
icons: {
  icon: "/favicon.png",
},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<header className="sticky top-0 z-50 backdrop-blur bg-bg/80 border-b border-white/10">
<nav className="container flex items-center justify-between py-3">
<div className="flex items-center gap-2 font-extrabold">
  <span
    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs text-white"
    style={{
      background: "linear-gradient(135deg, #14b8a6, #22d3ee)",
      boxShadow: "0 6px 16px rgba(20,184,166,.45)",
    }}
  >
    AH
  </span>
  <span>Ali Husseini</span>
</div>

<div className="flex items-center gap-3">
<Magnetic><a href="#projects" className="btn-outline">Projects</a></Magnetic>
<Magnetic><a href="#experience" className="btn-outline">Experience</a></Magnetic>
<Magnetic><a href="#skills" className="btn-outline">Skills</a></Magnetic>
<Magnetic><a href="#contact" className="btn-outline">Contact</a></Magnetic>
<Magnetic><a className="btn btn-primary" href="/assets/Ali-Husseini-Resume.pdf" download>Download Resume</a></Magnetic>
</div>
</nav>
</header>

{children}

<footer className="container text-muted text-center py-10">
© {new Date().getFullYear()} Ali Husseini • Built for speed & clarity
</footer>
</body>
</html>
);
}
