import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redireciona para a tela de login se não estiver autenticado
    }
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const botoes = [
    { href: "/oss", label: "OSS" },
    { href: "/denuncia", label: "DENÚNCIA" },
    { href: "/mdi", label: "MDI" },
    { href: "/servicos", label: "Serviços" },
    { href: "/necon", label: "Necon" },
    { href: "/servicos-secreto", label: "Serviços Secreto" },
    { href: "/documentos-sigilosos", label: "Documentos Sigilosos" },
    { href: "/artigos", label: "Artigos" },
  ];

  return (
    <div className="bg-[#2c2c2c] text-white min-h-screen relative overflow-x-hidden">
      {/* Botão hamburguer */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 text-3xl text-gray-200 focus:outline-none transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-[260px]" : ""
        }`}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-[#3a3a3a] text-white p-6 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } rounded-r-lg border-r border-[#555]`}
      >
        <h2 className="text-xl font-bold mb-6">Menu</h2>

        <Link
          href="/configuracao"
          className="flex items-center gap-2 w-full py-2 mb-4 hover:text-gray-300 transition-colors"
        >
          <span>Configurações</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300"
        >
          Sair
        </button>
      </div>

      {/* Header com logo do MDS */}
      <header className="flex flex-col items-center pt-10">
        <img
          src="https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png"
          alt="Logo MDS"
          className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[360px] mb-6 opacity-90 hover:opacity-100 transition-opacity duration-500"
        />
      </header>

      {/* Grid de botões */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 px-6 py-12 max-w-[1200px] mx-auto">
        {botoes.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-center text-center bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white py-6 px-6 rounded-2xl shadow-md border border-[#555] transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="font-semibold text-lg">{label}</span>
          </Link>
        ))}
      </div>

      {/* Modal de logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-[#2c2c2c] bg-opacity-70 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-[#3a3a3a] p-6 rounded-lg shadow-xl w-full sm:w-[400px] md:w-[500px] border border-[#555]">
            <h3 className="text-xl font-semibold text-gray-200 mb-6 text-center">
              Deseja realmente sair?
            </h3>
            <div className="flex justify-between gap-4">
              <button
                onClick={confirmLogout}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sim, sair
              </button>
              <button
                onClick={cancelLogout}
                className="w-full px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
