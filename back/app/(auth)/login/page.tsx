import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Accede a tu cuenta en ProjetFlow para gestionar tus proyectos y tareas.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">ProjetFlow</h1>
          <p className="text-gray-500 mt-2">Gestión de proyectos y equipos</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>
          <LoginForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tenés cuenta?{" "}
            <a href="/register" className="text-indigo-600 font-medium hover:underline">
              Registrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
