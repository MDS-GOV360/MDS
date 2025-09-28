"use client";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Modal reutilizável
function CustomModal({ isOpen, title, message, onClose, onConfirm, type = "alert" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-300 mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={type === "confirm" ? onConfirm : onClose}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition"
          >
            {type === "confirm" ? "Confirmar" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Config Firebase
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

export default function AlvosInvestigacao() {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("pre");
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [driveLink, setDriveLink] = useState("");
  const [audios, setAudios] = useState([]);
  const [prints, setPrints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alvos, setAlvos] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [printFiles, setPrintFiles] = useState([]);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "alert" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const collectionName = "alvos";

  useEffect(() => { fetchAlvos(filter); }, [filter]);

  const fetchAlvos = async (f) => {
  try {
    const col = collection(db, collectionName);
    const snap = await getDocs(query(col, orderBy("createdAt", "desc"))); // Apenas orderBy
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Filtra no frontend se não for "all"
    const filtered = f === "all" ? docs : docs.filter((d) => d.status === f);
    setAlvos(filtered);
  } catch (err) {
    console.error("Erro ao buscar alvos:", err);
    setAlertModal({
      isOpen: true,
      title: "Erro ao Buscar Alvos",
      message: "Erro ao buscar alvos. Veja o console para detalhes.",
      type: "alert",
    });
  }
};


  const fileToBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const handleAddSocialLink = () => setSocialLinks((s) => [...s, ""]);
  const handleSocialChange = (idx, value) => setSocialLinks((s) => s.map((it, i) => (i === idx ? value : it)));
  const handleRemoveSocial = (idx) => setSocialLinks((s) => s.filter((_, i) => i !== idx));

  const handleAudioFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    setAudioFiles(files);
    const converted = await Promise.all(files.map((f) => fileToBase64(f)));
    setAudios((a) => [...a, ...converted]);
  };

  const handlePrintFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    setPrintFiles(files);
    const converted = await Promise.all(files.map((f) => fileToBase64(f)));
    setPrints((p) => [...p, ...converted]);
  };

  const resetForm = () => {
    setNome("");
    setNascimento("");
    setSocialLinks([""]);
    setDriveLink("");
    setAudios([]);
    setPrints([]);
    setAudioFiles([]);
    setPrintFiles([]);
    setStatus("pre");
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      setAlertModal({ isOpen: true, title: "Erro", message: "Nome é obrigatório", type: "alert" });
      return;
    }
    const payload = {
      nome: nome.trim(),
      nascimento: nascimento || null,
      socialLinks: socialLinks.filter((s) => s && s.trim()),
      driveLink: driveLink || null,
      audios,
      prints,
      status,
      createdAt: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, collectionName), payload);
      resetForm();
      setModalOpen(false);
      fetchAlvos(filter);
      setAlertModal({ isOpen: true, title: "Sucesso", message: "Alvo salvo com sucesso", type: "alert" });
    } catch (err) {
      console.error(err);
      setAlertModal({ isOpen: true, title: "Erro", message: "Erro ao salvar. Veja o console.", type: "alert" });
    }
  };

  const handleDelete = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Confirmar Exclusão",
      message: "Deseja realmente excluir este alvo?",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, collectionName, id));
          fetchAlvos(filter);
          setAlertModal({ isOpen: true, title: "Sucesso", message: "Alvo excluído com sucesso", type: "alert" });
        } catch (err) {
          console.error(err);
          setAlertModal({ isOpen: true, title: "Erro", message: "Erro ao excluir alvo", type: "alert" });
        }
        setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const handleShare = (alvo) => {
    setAlertModal({ isOpen: true, title: "Compartilhar", message: `Funcionalidade de compartilhamento: ${alvo.nome}`, type: "alert" });
  };

  const handleDetails = (alvo) => {
    setAlertModal({ isOpen: true, title: "Detalhes", message: `Funcionalidade de detalhes: ${alvo.nome}`, type: "alert" });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2">
        <h2 className="text-2xl font-bold">Sistemas de Alvo de Investigação</h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded-xl w-full md:w-auto hover:bg-gray-700 transition"
          >
            <option value="all">Todos</option>
            <option value="pre">Pessoas Pré-investigadas</option>
            <option value="investigada">Pessoas Investigadas</option>
            <option value="pos">Pessoas Pós-investigadas</option>
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-5 py-2 rounded-xl text-white font-semibold transition"
          >
            Escolher Alvo
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {alvos.map((a) => (
          <div key={a.id} className="bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col transition hover:scale-105 hover:shadow-2xl">
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{a.nome}</h3>
                <p className="text-sm text-gray-300">Status: <span className="capitalize">{a.status}</span></p>
                {a.nascimento && <p className="text-sm text-gray-300">Nascimento: {a.nascimento}</p>}
              </div>
              <div className="text-xs text-gray-400 truncate">ID: {a.id}</div>
            </div>

            {a.socialLinks?.length > 0 && (
              <div className="mt-2 text-sm">
                <strong>Redes:</strong>
                <ul className="list-disc ml-5">
                  {a.socialLinks.map((s, i) => (
                    <li key={i}><a href={s} target="_blank" rel="noreferrer" className="text-blue-300 truncate hover:underline">{s}</a></li>
                  ))}
                </ul>
              </div>
            )}

            {a.driveLink && (
              <div className="mt-2">
                <strong>Drive:</strong>
                <div><a href={a.driveLink} target="_blank" rel="noreferrer" className="text-blue-300 hover:underline">Abrir link</a></div>
              </div>
            )}

            {a.prints?.length > 0 && (
              <div className="mt-2">
                <strong>Prints:</strong>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  {a.prints.map((p, i) => <img key={i} src={p} alt={`print-${i}`} className="w-full h-28 object-cover rounded-lg border border-gray-600" />)}
                </div>
              </div>
            )}

            {a.audios?.length > 0 && (
              <div className="mt-2">
                <strong>Áudios:</strong>
                <div className="flex flex-col gap-1 mt-1">
                  {a.audios.map((au, i) => <audio key={i} controls src={au} className="w-full rounded-md" />)}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <button onClick={() => handleShare(a)} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition">Compartilhar</button>
              <button onClick={() => handleDetails(a)} className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-lg transition">Detalhes</button>
              <button onClick={() => handleDelete(a.id)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg transition">Excluir</button>
            </div>
          </div>
        ))}
      </main>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-auto max-h-full">
            <h3 className="text-xl font-bold mb-4">Escolher Alvo</h3>

            <div className="mb-3">
              <label className="block text-sm mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                <option value="pre">Pré-investigada</option>
                <option value="investigada">Investigada</option>
                <option value="pos">Pós-investigada</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Nome *</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition" placeholder="Nome completo" />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Data de nascimento (opcional)</label>
              <input value={nascimento} onChange={(e) => setNascimento(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition" placeholder="YYYY-MM-DD" />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Redes sociais (opcional)</label>
              {socialLinks.map((s, i) => (
                <div key={i} className="flex gap-2 mb-2 flex-wrap">
                  <input value={s} onChange={(e) => handleSocialChange(i, e.target.value)} className="flex-1 min-w-[150px] p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition" placeholder="https://instagram.com/usuario" />
                  <button onClick={() => handleRemoveSocial(i)} className="bg-red-600 hover:bg-red-500 px-2 rounded-lg transition">X</button>
                </div>
              ))}
              <button onClick={handleAddSocialLink} className="mt-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md transition">+ Adicionar rede</button>
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Link do Google Drive (opcional)</label>
              <input value={driveLink} onChange={(e) => setDriveLink(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition" placeholder="https://drive.google.com/..." />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Áudios (opcional)</label>
              <div className="flex flex-col gap-2">
                <button type="button" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition" onClick={() => document.getElementById("audioInput").click()}>
                  Escolher Áudios
                </button>
                <input id="audioInput" type="file" accept="audio/*" multiple onChange={handleAudioFiles} className="hidden" />
                <p className="text-sm text-gray-300">{audioFiles.length > 0 ? audioFiles.map((f) => f.name).join(", ") : "Nenhum áudio selecionado"}</p>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Mensagens / Prints (opcional)</label>
              <div className="flex flex-col gap-2">
                <button type="button" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition" onClick={() => document.getElementById("printInput").click()}>
                  Escolher Prints
                </button>
                <input id="printInput" type="file" accept="image/*" multiple onChange={handlePrintFiles} className="hidden" />
                <p className="text-sm text-gray-300">{printFiles.length > 0 ? printFiles.map((f) => f.name).join(", ") : "Nenhum print selecionado"}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 mt-4">
              <button onClick={() => setModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition">Cancelar</button>
              <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <CustomModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal({ isOpen: false, title: "", message: "", type: "alert" })}
      />

      <CustomModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={() => setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null })}
        onConfirm={confirmModal.onConfirm}
        type="confirm"
      />
    </div>
  );
}
