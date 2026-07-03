import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <span className="text-2xl font-bold text-indigo-600">ProjetFlow</span>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-4 py-2">
            Iniciar sesión
          </Link>
          <Link href="/register"
            className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Registrarse
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Gestión de proyectos<br />
            <span className="text-indigo-600">para equipos ágiles</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Organizá tus proyectos, asigná tareas, hacé seguimiento del avance y
            colaborá con tu equipo en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
              Comenzar gratis
            </Link>
            <Link href="/login"
              className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl text-base font-medium hover:bg-gray-50 transition">
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {[
            { icon: "📁", title: "Proyectos", desc: "Creá y gestioná múltiples proyectos con estados y avance en tiempo real." },
            { icon: "✅", title: "Tareas", desc: "Organizá tareas por prioridad, estado y fecha límite con asignación de responsables." },
            { icon: "👥", title: "Equipos", desc: "Administradores, líderes y colaboradores con permisos diferenciados." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-gray-400">
        ProjetFlow &copy; {new Date().getFullYear()} — Sistema de Gestión de Proyectos
      </footer>
    </div>
  );
}
