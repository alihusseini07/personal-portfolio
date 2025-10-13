import Image from "next/image";
import { motion } from "framer-motion";

export interface Project {
title: string;
category: string;
tags: string[];
description: string;
stack: string[];
image?: string;
links?: { code?: string; live?: string; details?: string; drive?: string };
}

export default function ProjectCard({ p }: { p: Project }) {
return (
<motion.article
className="card overflow-hidden card-hover"
initial={{ opacity: 0, y: 8 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5 }}
>
<div className="aspect-video relative bg-[#0f141b]">
{p.image && <Image src={p.image} alt={p.title} fill className="object-cover" />}
</div>
<div className="p-4">
<div className="flex items-center justify-between gap-2">
<h3 className="text-lg font-semibold">{p.title}</h3>
<span className="badge">{p.category}</span>
</div>
<p className="text-muted text-sm my-2 min-h-[42px]">{p.description}</p>
<div className="flex flex-wrap gap-2 mb-2">
{p.stack.map((s, i) => (
<span key={i} className="badge">{s}</span>
))}
</div>
<div className="flex gap-2 flex-wrap">
{p.links?.code && <a className="btn-outline" href={p.links.code} target="_blank" rel="noreferrer">Code ↗</a>}
{p.links?.live && <a className="btn-outline" href={p.links.live} target="_blank" rel="noreferrer">Live ↗</a>}
{p.links?.details && <a className="btn-outline" href={p.links.details} target="_blank" rel="noreferrer">Details ↗</a>}
{p.links?.drive && <a className="btn-outline" href={p.links.drive} target="_blank" rel="noreferrer">Drive ↗</a>}
</div>
</div>
</motion.article>
);
}