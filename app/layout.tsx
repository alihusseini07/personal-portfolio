import "./globals.css";
import type { Metadata } from "next";
import { Orbitron, Space_Mono } from "next/font/google";
import Navbar from "../components/Navbar";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ali Husseini",
  description:
    "Personal portfolio of Ali Husseini — Mechatronics Engineering student at the University of Waterloo.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${spaceMono.variable}`}>
      <body>
        <Navbar />
        {children}
        <footer
          className="container text-center py-12"
          style={{
            color: "var(--muted)",
            fontSize: "0.8rem",
            borderTop: "1px solid rgba(255,255,255,.06)",
          }}
        >
          <p>© {new Date().getFullYear()} Ali Husseini</p>
        </footer>
      </body>
    </html>
  );
}
