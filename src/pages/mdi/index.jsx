import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHPDZ4pm0Jhz24_F5tIpsr9Pl1aJw001E",
  authDomain: "sistemas-mds-12424.firebaseapp.com",
  projectId: "sistemas-mds-12424",
  storageBucket: "sistemas-mds-12424.firebasestorage.app",
  messagingSenderId: "691988500460",
  appId: "1:691988500460:web:48be319cb8bf9a7c837ac9",
  measurementId: "G-LCXCH13VBV",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MINISTERIO = "Ministério das Relações Interpessoais";

export default function ArticlesApp() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [artigos, setArtigos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "artigos"), orderBy("data", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArtigos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const registrarArtigo = async () => {
    if (!titulo.trim() || !descricao.trim()) return;

    try {
      await addDoc(collection(db, "artigos"), {
        titulo,
        descricao,
        ministerio: MINISTERIO,
        data: serverTimestamp(),
      });

      setTitulo("");
      setDescricao("");
      setModalVisivel(true); // mostra o modal
      setTimeout(() => setModalVisivel(false), 2500); // fecha após 2,5s
    } catch (error) {
      console.error("Erro ao registrar artigo:", error);
    }
  };

  // Pesquisa por título ou descrição
  const artigosFiltrados = artigos.filter((a) =>
    pesquisa
      ? a.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
        a.descricao.toLowerCase().includes(pesquisa.toLowerCase())
      : true
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "720px", position: "relative" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Artigos - Ministério das Relações Interpessoais
        </h1>

        {/* Inputs de cadastro */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              outline: "none",
              backgroundColor: "#1F1F1F",
              color: "#EEEEEE",
              fontSize: "1rem",
            }}
            placeholder="Título do artigo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              outline: "none",
              backgroundColor: "#1F1F1F",
              color: "#EEEEEE",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: "100px",
            }}
            placeholder="Descrição do artigo"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <button
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              borderRadius: "0.5rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.2s",
              border: "none",
            }}
            onClick={registrarArtigo}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
          >
            Registrar Artigo
          </button>
        </div>

        {/* Barra de pesquisa */}
        <input
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            outline: "none",
            backgroundColor: "#1F1F1F",
            color: "#CCCCCC",
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
          placeholder="Pesquisar artigos (título ou descrição)..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

        {/* Lista de artigos */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {artigosFiltrados.length === 0 ? (
            <p style={{ color: "#9CA3AF" }}>Nenhum artigo encontrado</p>
          ) : (
            artigosFiltrados.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: "1rem 1.25rem",
                  backgroundColor: "#1F2937",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  cursor: "default",
                }}
              >
                <h2 style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                  {a.titulo}
                </h2>
                <p style={{ color: "#D1D5DB", marginBottom: "0.5rem" }}>{a.descricao}</p>
                <small style={{ color: "#9CA3AF" }}>{a.ministerio}</small>
              </div>
            ))
          )}
        </div>

        {/* Modal de sucesso */}
        {modalVisivel && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              padding: "1rem 1.5rem",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              fontWeight: "bold",
              animation: "fadeIn 0.3s",
              zIndex: 10,
            }}
          >
            ✅ Artigo registrado com sucesso!
          </div>
        )}
      </div>
    </div>
  );
}
