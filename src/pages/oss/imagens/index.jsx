'use client';

export default function Manutencao() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1D1D1D",
        color: "#FFF",
        fontFamily: "Segoe UI, sans-serif",
        textAlign: "center",
        padding: 20,
      }}
    >
      <img
        src="https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png"
        alt="Logo NECON"
        style={{ width: 140, maxWidth: "90%", marginBottom: 20 }}
      />
      <h1 style={{ fontSize: 30, marginBottom: 10, color: "#10B981" }}>
        Estamos em manutenção
      </h1>
      <p style={{ fontSize: 18, maxWidth: 500, lineHeight: 1.6 }}>
        Ainda estamos desenvolvendo esta função. Em breve, você poderá registrar e controlar seus gastos normalmente.
      </p>
      <p style={{ fontSize: 16, marginTop: 20, color: "#9CA3AF" }}>
        Agradecemos sua paciência!
      </p>
    </div>
  );
}
