import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Registrarse",
  description: "Creá tu cuenta en ProjetFlow y empezá a gestionar proyectos con tu equipo.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">ProjetFlow</h1>
          <p className="text-gray-500 mt-2">Gestión de proyectos y equipos</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crear cuenta</h2>
          <RegisterForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tenés cuenta?{" "}
            <a href="/login" className="text-indigo-600 font-medium hover:underline">
              Iniciá sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
