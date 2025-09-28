import Link from "next/link";

export default function OSS() {
  const botoes = [
    { href: "/email-secreto", label: "Email Secreto" },
    { href: "/oss/documento", label: "Documento" },
    { href: "/oss/audios", label: "Áudios" },
    { href: "/oss/pdfs", label: "PDFs" },
    { href: "/oss/gravacoes", label: "Gravações" },
    { href: "/oss/imagens", label: "Imagens" },
    { href: "/oss/videos", label: "Vídeos" },
    { href: "/oss/servicos-sigilosos", label: "Serviços Sigilosos" },
    { href: "/oss/alvos-investigacao", label: "Alvos de Investigação" },
     { href: "/oss/relatorio", label: "Relatorio" },
  ];

  return (
    <div className="relative min-h-screen text-white">
      {/* Fundo com imagem */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://ateky.com.br/wp-content/uploads/2025/04/Foto_blog_3_abril_2025-transformed-scaled.jpeg')",
        }}
      ></div>

      {/* Overlay escuro para melhor contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Header com logo do MDS */}
        <header className="flex flex-col items-center pt-10">
          <img
            src="https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png"
            alt="Logo MDS"
            className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[360px] mb-8 opacity-90 hover:opacity-100 transition-opacity duration-500"
          />
          <h1 className="text-3xl font-bold mb-6 text-center">
            Organização Social Secreta
          </h1>
        </header>

        {/* Grid de botões */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-6 py-12 max-w-[1200px] mx-auto">
          {botoes.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center text-center bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white py-6 px-4 rounded-2xl shadow-md border border-[#555] transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="font-semibold text-lg">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
