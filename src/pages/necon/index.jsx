"use client";

import { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import jsPDF from "jspdf";

// 🔹 Config Firebase
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

export default function Home() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [gastos, setGastos] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // 🔹 Buscar gastos
  useEffect(() => {
    const q = query(collection(db, "gastos"), orderBy("data", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setGastos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Registrar gasto
  const registrarGasto = async () => {
    if (!descricao.trim() || !valor) return;
    await addDoc(collection(db, "gastos"), { descricao, valor: parseFloat(valor), data: serverTimestamp() });
    setDescricao(""); setValor("");
  };

  // 🔹 Gerar PDF com jsPDF
  const gerarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoUrl = "https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png";
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = logoUrl;
    img.onload = () => {
      const logoWidth = 30; // logo menor
      const logoHeight = 15; // logo menor
      const text = "NECON = Núcleo de Economia, Controle e Orçamento Nacional";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14); // texto menor
      const textWidth = doc.getTextWidth(text);

      // Centralizar logo + texto juntos
      const totalWidth = logoWidth + 8 + textWidth; // espaçamento menor
      const startX = (pageWidth - totalWidth) / 2;
      const startY = 10;

      doc.addImage(img, "PNG", startX, startY, logoWidth, logoHeight);
      doc.text(text, startX + logoWidth + 8, startY + logoHeight / 2 + 4);

      // Tabela
      let y = 40;
      const rowHeight = 10;
      let total = 0;

      // Cabeçalho da tabela
      doc.setFillColor(21, 101, 192);
      doc.setTextColor(255, 255, 255);
      doc.rect(10, y, pageWidth - 20, rowHeight, "F");
      doc.text("Descrição", 15, y + 7);
      doc.text("Valor (R$)", pageWidth - 35, y + 7, { align: "right" });
      y += rowHeight;

      // Linhas da tabela
      gastos.forEach((g, index) => {
        doc.setFillColor(index % 2 === 0 ? 245 : 230, index % 2 === 0 ? 245 : 230, index % 2 === 0 ? 245 : 230);
        doc.setTextColor(0, 0, 0);
        doc.rect(10, y, pageWidth - 20, rowHeight, "F");
        doc.text(g.descricao, 15, y + 7);
        doc.text(g.valor.toFixed(2), pageWidth - 35, y + 7, { align: "right" });
        total += g.valor;
        y += rowHeight;
        if (y > pageHeight - 30) { doc.addPage(); y = 20; }
      });

      doc.setTextColor(0, 128, 0);
      doc.setFontSize(12);
      doc.text(`Total: R$ ${total.toFixed(2)}`, pageWidth - 15, y + 10, { align: "right" });

      // Assinatura
      if (canvasRef.current) {
        const imgData = canvasRef.current.toDataURL("image/png");
        doc.addPage();
        doc.text("Assinatura:", 15, 20);
        doc.addImage(imgData, "PNG", 15, 30, pageWidth - 30, 60);
      }

      // Gerar URL para visualização
      const blobUrl = doc.output('bloburl');
      setPdfUrl(blobUrl);
    };
  };

  // 🔹 Canvas assinatura
  const startDrawing = e => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2.5; ctx.lineCap = "round";
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  const draw = e => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#000"; ctx.stroke();
  };
  const stopDrawing = () => setDrawing(false);
  const limparAssinatura = () => canvasRef.current.getContext("2d").clearRect(0,0,canvasRef.current.width,canvasRef.current.height);

  return (
    <div style={{ padding: 20, fontFamily: "Segoe UI", backgroundColor: "#121212", color: "#FFF", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, marginBottom: 10, color: "#10B981" }}>NECON - Controle de Gastos</h1>

      <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
        <input type="text" placeholder="Descrição" value={descricao} onChange={e=>setDescricao(e.target.value)} style={{ flex:2, padding:5, borderRadius:5, backgroundColor:"#1F2937", color:"#FFF", border:"none" }} />
        <input type="number" placeholder="Valor" value={valor} onChange={e=>setValor(e.target.value)} style={{ flex:1, padding:5, borderRadius:5, backgroundColor:"#1F2937", color:"#FFF", border:"none" }} />
        <button onClick={registrarGasto} style={{ padding:5, borderRadius:5, backgroundColor:"#2563EB", color:"#FFF", cursor:"pointer" }}>Registrar</button>
      </div>

      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:10 }}>
        <thead>
          <tr>
            <th style={{ borderBottom:"2px solid #2563EB", padding:5, textAlign:"left" }}>Descrição</th>
            <th style={{ borderBottom:"2px solid #2563EB", padding:5, textAlign:"right" }}>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map(g=><tr key={g.id}><td style={{padding:5}}>{g.descricao}</td><td style={{padding:5,textAlign:"right"}}>{g.valor.toFixed(2)}</td></tr>)}
        </tbody>
      </table>

      <div style={{ display:'flex', gap:5, marginBottom:10 }}>
        <button onClick={gerarPDF} style={{ padding:5, borderRadius:5, backgroundColor:"#10B981", color:"#FFF", cursor:"pointer" }}>Gerar PDF</button>
        <button onClick={limparAssinatura} style={{ padding:5, borderRadius:5, backgroundColor:"#EF4444", color:"#FFF", cursor:"pointer" }}>Limpar Assinatura</button>
      </div>

      <p>Assinatura:</p>
      <canvas ref={canvasRef} width={600} height={150} style={{ border:"2px solid #2563EB", borderRadius:8, backgroundColor:"#FFF", cursor:"crosshair" }} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}></canvas>

      {pdfUrl && (
        <div>
          <h2>Visualização do PDF:</h2>
          <iframe src={pdfUrl} width="100%" height={400} style={{ border:"2px solid #2563EB", borderRadius:8 }} />
        </div>
      )}
    </div>
  );
}
