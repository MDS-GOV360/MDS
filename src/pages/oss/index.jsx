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
    { href: "/oss/relatorio", label: "Relatório" },
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#FFFFFF", backgroundColor: "#1D1D1D" }}>
      {/* Overlay leve com HEX */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(29, 29, 29, 0.2)" }}></div>

      {/* Conteúdo */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Header com logo do MDS */}
        <header style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, paddingLeft: 16, paddingRight: 16 }}>
          <img
            src="https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png"
            alt="Logo MDS"
            style={{ width: "100%", maxWidth: 360, marginBottom: 32, opacity: 0.9, transition: "opacity 0.5s" }}
          />
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: 24, textAlign: "center" }}>
            Organização Social Secreta
          </h1>
        </header>

        {/* Grid de botões */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 24,
          padding: "48px 16px",
          maxWidth: 1200,
          margin: "0 auto"
        }}>
          {botoes.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "#2A2A2A",
              color: "#FFFFFF",
              padding: "24px 16px",
              borderRadius: 24,
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              border: "1px solid #555555",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.3s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3A3A3A"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2A2A2A"}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
