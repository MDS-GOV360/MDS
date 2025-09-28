"use client";

export default function Manutencao() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#FFF",
        fontFamily: "Segoe UI",
        textAlign: "center",
        padding: 20,
      }}
    >
      <img
        src="https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png"
        alt="Logo NECON"
        style={{ width: 120, marginBottom: 20 }}
      />
      <h1 style={{ fontSize: 28, marginBottom: 10, color: "#10B981" }}>
        Estamos em manutenção
      </h1>
      <p style={{ fontSize: 18, maxWidth: 500 }}>
        Ainda estamos desenvolvendo esta função. Em breve, você poderá registrar e controlar seus gastos normalmente.
      </p>
      <p style={{ fontSize: 16, marginTop: 20, color: "#9CA3AF" }}>
        Agradecemos sua paciência!
      </p>
    </div>
  );
}
