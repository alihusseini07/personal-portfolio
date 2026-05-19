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
    <section id={id} className="container py-4 md:py-6">
      {/* Section header — terminal style */}
      <motion.div
        className="mb-5 flex items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <span
          style={{
            fontFamily: "var(--font-body, monospace)",
            color: "var(--cyan)",
            fontSize: "0.9rem",
            textShadow: "0 0 8px rgba(0,245,255,.7)",
            flexShrink: 0,
          }}
        >
          &gt;/
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display, monospace)",
            fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
            letterSpacing: "0.18em",
            color: "#ffffff",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(90deg, rgba(0,245,255,.3), transparent)",
          }}
        />
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
