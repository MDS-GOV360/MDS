"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query } from "firebase/firestore";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHPDZ4pm0Jhz24_F5tIpsr9Pl1aJw001E",
  authDomain: "sistemas-mds-12424.firebaseapp.com",
  projectId: "sistemas-mds-12424",
  storageBucket: "sistemas-mds-12424.firebasestorage.app",
  messagingSenderId: "691988500460",
  appId: "1:691988500460:web:48be319cb8bf9a7c837ac9",
  measurementId: "G-LCXCH13VBV"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Publicacoes() {
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [search, setSearch] = useState("");
  const [publicacoes, setPublicacoes] = useState([]);
  const [modalMsg, setModalMsg] = useState(""); 
  const [showModal, setShowModal] = useState(false);

  // Carrega publicações do Firestore
  useEffect(() => {
    const carregarPublicacoes = async () => {
      const q = query(collection(db, "publicacoes"));
      const snapshot = await getDocs(q);
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicacoes(dados);
    };
    carregarPublicacoes();
  }, []);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!titulo || !link) {
      setModalMsg("Preencha título e link!");
      setShowModal(true);
      return;
    }

    try {
      // Adiciona no Firestore
      const docRef = await addDoc(collection(db, "publicacoes"), {
        titulo,
        link,
        criadoEm: new Date()
      });

      // Atualiza lista local
      setPublicacoes([...publicacoes, { id: docRef.id, titulo, link }]);
      setTitulo("");
      setLink("");
      setModalMsg("Publicação adicionada com sucesso!");
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao adicionar publicação:", error);
      setModalMsg("Erro ao adicionar publicação!");
      setShowModal(true);
    }
  };

  const publicacoesFiltradas = publicacoes.filter((p) =>
    p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#f0f0f0", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "30px", fontWeight: "bold" }}>
        Relatório
      </h1>

      {/* Barra de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar títulos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #333333",
          backgroundColor: "#2a2a2a",
          color: "#f0f0f0",
        }}
      />

      {/* Formulário de nova publicação */}
      <form onSubmit={handleAdicionar} style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333333",
            backgroundColor: "#2a2a2a",
            color: "#f0f0f0",
          }}
        />
        <input
          type="text"
          placeholder="Link do Google Drive"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333333",
            backgroundColor: "#2a2a2a",
            color: "#f0f0f0",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundImage: "linear-gradient(90deg, #0077ff, #00c6ff)",
            color: "#ffffff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Adicionar Publicação
        </button>
      </form>

      {/* Lista de publicações */}
<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
  {publicacoesFiltradas.length === 0 ? (
    <p style={{ textAlign: "center", color: "#aaaaaa", fontStyle: "italic" }}>
      Nenhuma publicação encontrada.
    </p>
  ) : (
    publicacoesFiltradas.map((p) => (
      <div
        key={p.id}
        style={{
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "#2a2a2a",
          boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ffffff" }}>
          {p.titulo}
        </h2>

        <a
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundImage: "linear-gradient(90deg, #0077ff, #00c6ff)",
            color: "#fff",
            fontWeight: "bold",
            textDecoration: "none",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.85)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Abrir Link
        </a>
      </div>
    ))
  )}
</div>


      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              padding: "20px 30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#f0f0f0",
              maxWidth: "300px",
            }}
          >
            <p>{modalMsg}</p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#0077ff",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
