module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        panel: "#0f141b",
        text: "#e6eef8",
        muted: "#a8b3c2",
        primary: "#69a8ff",
        primary2: "#7c79ff",
        outline: "rgba(255,255,255,.12)",
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        soft: "0 12px 34px rgba(0,0,0,.35)",
      },
    },
  },
  plugins: [],
};