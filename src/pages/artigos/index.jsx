"use client";
import React, { useEffect, useState } from "react";

export default function ArtigosPage() {
  const [status, setStatus] = useState("Carregando...");
  const [artigos, setArtigos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [modalSucesso, setModalSucesso] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
      import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyDHPDZ4pm0Jhz24_F5tIpsr9Pl1aJw001E",
        authDomain: "sistemas-mds-12424.firebaseapp.com",
        projectId: "sistemas-mds-12424",
        storageBucket: "sistemas-mds-12424.firebasestorage.app",
        messagingSenderId: "691988500460",
        appId: "1:691988500460:web:48be319cb8bf9a7c837ac9",
        measurementId: "G-LCXCH13VBV"
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      window.__FIREBASE_DB__ = db;
      window.__FIREBASE_COLLECTION__ = collection;
      window.__FIREBASE_ADD_DOC__ = addDoc;
      window.__FIREBASE_GET_DOCS__ = getDocs;
    `;
    script.onload = () => setStatus("Pronto ✅");
    script.onerror = () => setStatus("Erro ao carregar ❌");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function carregarArtigos() {
    if (!window.__FIREBASE_DB__) return;
    const db = window.__FIREBASE_DB__;
    const collection = window.__FIREBASE_COLLECTION__;
    const getDocs = window.__FIREBASE_GET_DOCS__;
    const snapshot = await getDocs(collection(db, "artigos"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setArtigos(lista);
  }

  async function registrarArtigo() {
    if (!novoTitulo || !novaDescricao) return;
    const db = window.__FIREBASE_DB__;
    const collection = window.__FIREBASE_COLLECTION__;
    const addDoc = window.__FIREBASE_ADD_DOC__;
    await addDoc(collection(db, "artigos"), {
      titulo: novoTitulo,
      descricao: novaDescricao,
    });
    setNovoTitulo("");
    setNovaDescricao("");
    setShowModal(false);
    setModalSucesso(true);
    carregarArtigos();
  }

  function compartilharArtigo(artigo) {
    const texto = `Confira este artigo: ${artigo.titulo} - ${artigo.descricao}`;
    navigator.clipboard.writeText(texto);
    alert("Artigo copiado para compartilhar!");
  }

  const artigosFiltrados = artigos.filter(
    (a) =>
      a.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
      a.descricao.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#ffffff", padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Header estilizado */}
      <div style={{ backgroundColor: "#262626", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.5)", textAlign: "center", marginBottom: "2rem", border: "1px solid #333333" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", letterSpacing: "2px" }}>Artigos</h1>
        <p style={{ color: "#b3b3b3", marginTop: "0.5rem" }}>{status}</p>
      </div>

      {/* Barra de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar artigo por título ou descrição..."
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          backgroundColor: "#262626",
          border: "1px solid #404040",
          marginBottom: "1.5rem",
          color: "#ffffff"
        }}
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      {/* Botões principais */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#16a34a", borderRadius: "8px", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}
        >
          Registrar Artigo
        </button>
        <button
          onClick={carregarArtigos}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#2563eb", borderRadius: "8px", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}
        >
          Ver Artigos
        </button>
      </div>

      {/* Lista de artigos */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {artigosFiltrados.map((artigo) => (
          <div
            key={artigo.id}
            style={{ backgroundColor: "#262626", padding: "1.25rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)", border: "1px solid #333333" }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{artigo.titulo}</h2>
            <p style={{ color: "#d1d5db", marginBottom: "1rem" }}>{artigo.descricao}</p>
            <button
              onClick={() => compartilharArtigo(artigo)}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#9333ea", borderRadius: "6px", border: "none", color: "#fff", cursor: "pointer" }}
            >
              Compartilhar
            </button>
          </div>
        ))}
      </div>

      {/* Modal de registrar artigo */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div style={{ backgroundColor: "#262626", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.6)", width: "100%", maxWidth: "400px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Registrar Artigo</h2>
            <input
              type="text"
              placeholder="Título"
              style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", backgroundColor: "#404040", border: "1px solid #525252", color: "#fff" }}
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />
            <textarea
              placeholder="Descrição"
              style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", backgroundColor: "#404040", border: "1px solid #525252", color: "#fff" }}
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#dc2626", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                onClick={registrarArtigo}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#16a34a", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sucesso */}
      {modalSucesso && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div style={{ backgroundColor: "#262626", padding: "1.5rem", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.6)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Artigo registrado com sucesso!</h2>
            <button
              onClick={() => setModalSucesso(false)}
              style={{ padding: "0.5rem 1.25rem", backgroundColor: "#2563eb", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
