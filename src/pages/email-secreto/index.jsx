'use client';

import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

export default function EmailSecreto() {
  const firebaseConfig = {
    apiKey: "AIzaSyDHPDZ4pm0Jhz24_F5tIpsr9Pl1aJw001E",
    authDomain: "sistemas-mds-12424.firebaseapp.com",
    projectId: "sistemas-mds-12424",
    storageBucket: "sistemas-mds-12424.firebasestorage.app",
    messagingSenderId: "691988500460",
    appId: "1:691988500460:web:48be319cb8bf9a7c837ac9",
    measurementId: "G-LCXCH13VBV"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState(null);
  const [emailsCadastrados, setEmailsCadastrados] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const registrarEmail = async (e) => {
    e.preventDefault();
    if (!nome || !email || !foto) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await addDoc(collection(db, "emails_secreto"), {
        nome,
        email,
        foto,
        criadoEm: new Date()
      });
      setNome("");
      setEmail("");
      setFoto(null);
      setModalAberto(true);
      buscarEmails();
    } catch (error) {
      console.error("Erro ao registrar email: ", error);
      alert("Erro ao registrar email.");
    }
  };

  const buscarEmails = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "emails_secreto"));
      const listaEmails = [];
      querySnapshot.forEach((doc) => listaEmails.push({ id: doc.id, ...doc.data() }));
      setEmailsCadastrados(listaEmails);
    } catch (error) {
      console.error("Erro ao buscar emails: ", error);
    }
  };

  useEffect(() => {
    buscarEmails();
  }, []);

  return (
    <div className="relative min-h-screen text-white bg-[#1D1D1D] p-4 sm:p-6">
      {/* Logo MDS */}
      <header className="flex flex-col items-center pt-10">
        <img
          src="https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png"
          alt="Logo MDS"
          className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[360px] mb-8 opacity-90 hover:opacity-100 transition-opacity duration-500"
        />
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Email Secreto</h1>
      </header>

      {/* Formulário */}
      <div className="max-w-md mx-auto p-6 bg-[#2a2a2a] rounded-2xl shadow-lg border border-[#555]">
        <form onSubmit={registrarEmail} className="flex flex-col gap-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-4 py-3 rounded-xl bg-[#333] border border-[#555] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            className="w-full px-4 py-3 rounded-xl bg-[#333] border border-[#555] text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <div className="w-full">
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md shadow-md transition-colors">
              Selecionar Foto
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all"
          >
            Registrar Email
          </button>
        </form>
      </div>

      {/* Lista de emails cadastrados */}
      <div className="max-w-md mx-auto mt-8 p-6 bg-[#2a2a2a] rounded-2xl shadow-lg border border-[#555]">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Emails Registrados</h2>
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {emailsCadastrados.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-2 bg-[#333] rounded-xl border border-[#555]">
              {item.foto && <img src={item.foto} alt={item.nome} className="w-10 h-10 rounded-full object-cover" />}
              <div>
                <p className="font-semibold">{item.nome}</p>
                <p className="text-sm text-gray-300">{item.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de sucesso */}
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Registrado com sucesso!</h3>
            <button
              onClick={() => setModalAberto(false)}
              className="px-6 py-2 bg-green-600 rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
