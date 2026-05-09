module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#060b12",
        panel:    "#0c1520",
        elevated: "#111c2d",
        text:     "#e2e8f0",
        muted:    "#7a9ab3",
        background: "#060b12",
        primary: {
          DEFAULT:    "#22d3ee",
          foreground: "#030c14",
        },
        primary2: "#34d399",
        outline:  "rgba(255,255,255,.08)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0,0,0,.5)",
        card: "0 1px 2px rgba(0,0,0,.7), 0 8px 24px rgba(0,0,0,.4)",
        glow: "0 0 0 1px rgba(34,211,238,.15), 0 8px 32px rgba(34,211,238,.12)",
      },
      letterSpacing: {
        tighter2: "-0.04em",
      },
    },
  },
  plugins: [],
};
