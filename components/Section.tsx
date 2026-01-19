import { motion } from "framer-motion";

const variants = {
hidden: { opacity: 0, y: 14, scale: 0.985 },
show: { opacity: 1, y: 0, scale: 1 },
};

export default function Section({
id,
title,
children,
}: {
id?: string;
title: string;
children: React.ReactNode;
}) {
return (
<section id={id} className="container py-10">
<motion.h2
className="text-3xl md:text-4xl font-extrabold mb-4 text-center text-gradient-teal"
initial="hidden"
whileInView="show"
viewport={{ once: true, amount: 0.3 }}
variants={variants}
transition={{ duration: 0.55, ease: "easeOut" }}
>
{title}
</motion.h2>

<motion.div
initial="hidden"
whileInView="show"
viewport={{ once: true, amount: 0.25 }}
variants={variants}
transition={{ duration: 0.6, ease: "easeOut" }}
>
{children}
</motion.div>
</section>
);
}
