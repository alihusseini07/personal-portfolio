import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "../components/Navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ali Husseini | Portfolio",
  description:
    "Personal portfolio of Ali Husseini — Mechatronics Engineering student at the University of Waterloo.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
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
          <p>© {new Date().getFullYear()} Ali Husseini · Built with Next.js & Tailwind CSS</p>
        </footer>
      </body>
    </html>
  );
}
