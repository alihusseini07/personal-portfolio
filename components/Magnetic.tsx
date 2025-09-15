"use client";

import { useRef } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { strength?: number };

export default function Magnetic({ children, strength = 14, className = "", ...rest }: Props) {
const ref = useRef<HTMLDivElement>(null);

const onMove = (e: React.MouseEvent) => {
const el = ref.current;
if (!el) return;
const rect = el.getBoundingClientRect();
const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
};

const onLeave = () => {
const el = ref.current;
if (!el) return;
el.style.transform = "translate(0,0)";
};

return (
<div
ref={ref}
className={`magnetic ${className}`}
onMouseMove={onMove}
onMouseLeave={onLeave}
{...rest}
>
{children}
</div>
);
}