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
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      {/* Cabeçalho */}
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Serviços Sigilosos</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-xl transition"
        >
          Nova Publicação
        </button>
      </header>

      {/* Lista de publicações */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {publicacoes.map((pub) => (
          <div key={pub.id} className="bg-gray-800 rounded-2xl shadow p-4 flex flex-col">
            <img
              src={pub.image}
              alt="Imagem"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-center gap-4 mt-auto">
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium transition"
              >
                Acessar
              </a>
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium transition">
                Compartilhar
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium transition">
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Nova Publicação</h2>

            <input
              type="text"
              placeholder="Link do Google Drive"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full mb-3 p-2 rounded-lg bg-gray-700 text-white outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-3 p-2 rounded-lg bg-gray-700 text-white outline-none"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
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
