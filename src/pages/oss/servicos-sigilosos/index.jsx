"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

// Configuração do Firebase
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

export default function ServicosSigilosos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [publicacoes, setPublicacoes] = useState([]);

  // Buscar publicações
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "publicacoes"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setPublicacoes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // Converter imagem para Base64
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Salvar publicação
  const handleSave = async () => {
    if (!link || !image) {
      alert("Preencha todos os campos!");
      return;
    }

    await addDoc(collection(db, "publicacoes"), {
      link,
      image,
      createdAt: serverTimestamp(),
    });

    setLink("");
    setImage("");
    setModalOpen(false);

    const q = query(collection(db, "publicacoes"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setPublicacoes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1D1D1D", color: "#FFFFFF", padding: 32 }}>
      {/* Cabeçalho */}
      <header style={{ maxWidth: 1024, margin: "0 auto 32px auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Serviços Sigilosos</h1>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            backgroundColor: "#4A4A4A",
            color: "#FFFFFF",
            fontWeight: 600,
            padding: "8px 20px",
            borderRadius: 12,
            transition: "background-color 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5A5A5A")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4A4A4A")}
        >
          Nova Publicação
        </button>
      </header>

      {/* Lista de publicações */}
      <div
        style={{
          maxWidth: 1024,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {publicacoes.map((pub) => (
          <div key={pub.id} style={{ backgroundColor: "#2A2A2A", borderRadius: 24, padding: 16, display: "flex", flexDirection: "column", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
            <img
              src={pub.image}
              alt="Imagem"
              style={{ width: "100%", height: 192, objectFit: "cover", borderRadius: 16, marginBottom: 16 }}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#3A3A3A",
                  color: "#FFFFFF",
                  padding: "8px 12px",
                  borderRadius: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A4A4A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
              >
                Acessar
              </a>
              <button
                style={{
                  backgroundColor: "#3A3A3A",
                  color: "#FFFFFF",
                  padding: "8px 12px",
                  borderRadius: 12,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A4A4A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
              >
                Compartilhar
              </button>
              <button
                style={{
                  backgroundColor: "#3A3A3A",
                  color: "#FFFFFF",
                  padding: "8px 12px",
                  borderRadius: 12,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A4A4A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
              >
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(29,29,29,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div style={{ backgroundColor: "#2A2A2A", padding: 24, borderRadius: 24, boxShadow: "0 8px 12px rgba(0,0,0,0.5)", width: 384 }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 16 }}>Nova Publicação</h2>

            <input
              type="text"
              placeholder="Link do Google Drive"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 12, backgroundColor: "#3A3A3A", color: "#FFFFFF", border: "none", outline: "none" }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 12, backgroundColor: "#3A3A3A", color: "#FFFFFF", border: "none", outline: "none" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{ backgroundColor: "#4A4A4A", padding: "8px 16px", borderRadius: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "background-color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5A5A5A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4A4A4A")}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                style={{ backgroundColor: "#3A3A3A", padding: "8px 16px", borderRadius: 12, fontWeight: 600, cursor: "pointer", border: "none", color: "#FFFFFF", transition: "background-color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A4A4A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3A3A3A")}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
