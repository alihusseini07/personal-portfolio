"use client";

import { useEffect, useState } from "react";

const navLinks = [
{ href: "#projects", label: "Projects" },
{ href: "#experience", label: "Experience" },
{ href: "#skills", label: "Skills" },
{ href: "#contact", label: "Contact" },
];

export default function Navbar() {
const [active, setActive] = useState<string>("");

useEffect(() => {
const onScroll = () => {
const byDistance = navLinks
.map((l) => {
const el = document.querySelector(l.href) as HTMLElement | null;
return { href: l.href, top: el ? Math.abs(el.getBoundingClientRect().top) : Infinity };
})
.sort((a, b) => a.top - b.top);
setActive(byDistance[0]?.href || "");
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
return () => window.removeEventListener("scroll", onScroll);
}, []);

const smoothTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
const el = document.querySelector(href);
if (!el) return;
e.preventDefault();
el.scrollIntoView({ behavior: "smooth", block: "start" });
history.replaceState(null, "", href);
};

return (
<header className="sticky top-0 z-50 backdrop-blur bg-bg/80 border-b border-white/10">
<nav className="container flex items-center justify-between py-3">
<div className="flex items-center gap-2 font-extrabold">
<span
className="inline-block w-6 h-6 rounded-lg"
style={{ background: "linear-gradient(135deg, #69a8ff, #7c79ff)", boxShadow: "0 6px 16px rgba(110,170,255,.45)" }}
aria-hidden
/>
<span>Ali Husseini</span>
</div>
<div className="flex items-center gap-3">
{navLinks.map((l) => (
<a
key={l.href}
href={l.href}
onClick={(e) => smoothTo(e, l.href)}
className={active === l.href ? "chip chip-active" : "chip"}
>
{l.label}
</a>
))}
<a className="btn btn-primary" href="/assets/Ali-Husseini-Resume.pdf" download>
Download Resume
</a>
</div>
</nav>
</header>
);
}