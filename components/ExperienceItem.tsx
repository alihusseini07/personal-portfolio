import { motion } from "framer-motion";

export interface Experience {
role: string;
org: string;
location: string;
dates: string;
bullets: string[];
}

export default function ExperienceItem({ xp }: { xp: Experience }) {
return (
<motion.div
className="card p-4 card-hover"
initial={{ opacity: 0, y: 8 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.45 }}
style={{ border: "1px solid color-mix(in oklab, var(--teal) 55%, transparent)" as any }}
>
<div className="flex justify-between gap-3">
<div>
<div className="font-bold" style={{ color: "var(--teal)" }}>{xp.role}</div>
<div className="text-muted text-sm">{xp.org} • {xp.location} • {xp.dates}</div>
</div>
</div>
<ul className="mt-3 grid gap-2">
{xp.bullets.map((b, i) => (
<li key={i} className="badge">{b}</li>
))}
</ul>
</motion.div>
);
}