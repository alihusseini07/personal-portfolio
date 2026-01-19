module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        panel: "#080d14",
        text: "#e8f3ff",
        muted: "#9fb2c8",
        primary: "#22d3ee",
        primary2: "#34d399",
        outline: "rgba(255,255,255,.1)",
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        soft: "0 12px 34px rgba(0,0,0,.35)",
      },
    },
  },
  plugins: [],
};
