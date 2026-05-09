import { motion } from "framer-motion";

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
    <section id={id} className="container py-4 md:py-5">
      {/* Section header */}
      <motion.div
        className="mb-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <h2
          className="text-gradient font-display font-bold"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.25rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h2>
        <span className="section-title-bar" />
      </motion.div>

      {/* Section content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
