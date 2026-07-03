import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ProjetFlow – Gestión de Proyectos",
    template: "%s | ProjetFlow",
  },
  description:
    "Plataforma de gestión de proyectos y tareas. Organiza equipos, asigna responsables y haz seguimiento del avance en tiempo real.",
  keywords: ["gestión de proyectos", "tareas", "equipos", "productividad", "colaboración"],
  authors: [{ name: "ProjetFlow" }],
  creator: "ProjetFlow",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "http://localhost:3000",
    title: "ProjetFlow – Gestión de Proyectos",
    description: "Organiza proyectos, asigna tareas y haz seguimiento con tu equipo.",
    siteName: "ProjetFlow",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
