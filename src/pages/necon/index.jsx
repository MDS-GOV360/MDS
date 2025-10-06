"use client";

import { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
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
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGastos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Registrar gasto
  const registrarGasto = async () => {
    if (!descricao.trim() || !valor) return;
    await addDoc(collection(db, "gastos"), {
      descricao,
      valor: parseFloat(valor),
      data: serverTimestamp()
    });
    setDescricao("");
    setValor("");
  };

  // 🔹 Gerar PDF
  const gerarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoUrl =
      "https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png";
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = logoUrl;
    img.onload = () => {
      const logoWidth = 30;
      const logoHeight = 15;
      const text =
        "NECON = Núcleo de Economia, Controle e Orçamento Nacional";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const textWidth = doc.getTextWidth(text);

      const totalWidth = logoWidth + 8 + textWidth;
      const startX = (pageWidth - totalWidth) / 2;
      const startY = 10;

      doc.addImage(img, "PNG", startX, startY, logoWidth, logoHeight);
      doc.text(text, startX + logoWidth + 8, startY + logoHeight / 2 + 4);

      // Tabela
      let y = 40;
      const rowHeight = 10;
      let total = 0;

      doc.setFillColor(21, 101, 192);
      doc.setTextColor(255, 255, 255);
      doc.rect(10, y, pageWidth - 20, rowHeight, "F");
      doc.text("Descrição", 15, y + 7);
      doc.text("Valor (R$)", pageWidth - 35, y + 7, { align: "right" });
      y += rowHeight;

      gastos.forEach((g, index) => {
        doc.setFillColor(
          index % 2 === 0 ? 245 : 230,
          index % 2 === 0 ? 245 : 230,
          index % 2 === 0 ? 245 : 230
        );
        doc.setTextColor(0, 0, 0);
        doc.rect(10, y, pageWidth - 20, rowHeight, "F");
        doc.text(g.descricao, 15, y + 7);
        doc.text(g.valor.toFixed(2), pageWidth - 35, y + 7, { align: "right" });
        total += g.valor;
        y += rowHeight;
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
      });

      doc.setTextColor(0, 128, 0);
      doc.setFontSize(12);
      doc.text(`Total: R$ ${total.toFixed(2)}`, pageWidth - 15, y + 10, {
        align: "right"
      });

      // Assinatura
      if (canvasRef.current) {
        const imgData = canvasRef.current.toDataURL("image/png");
        doc.addPage();
        doc.text("Assinatura:", 15, 20);
        doc.addImage(imgData, "PNG", 15, 30, pageWidth - 30, 60);
      }

      const blobUrl = doc.output("bloburl");
      setPdfUrl(blobUrl);
    };
  };

  // 🔹 Canvas assinatura
  const startDrawing = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#000";
    ctx.stroke();
  };
  const stopDrawing = () => setDrawing(false);
  const limparAssinatura = () =>
    canvasRef.current
      .getContext("2d")
      .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  // 🔹 Layout
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#3b3b3b",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "20px",
            textAlign: "center",
            color: "#10B981"
          }}
        >
          NECON - Controle de Gastos
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "15px"
          }}
        >
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{
              flex: "2 1 200px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#334155",
              color: "#fff",
              border: "none",
              fontSize: "14px"
            }}
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={{
              flex: "1 1 100px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#334155",
              color: "#fff",
              border: "none",
              fontSize: "14px"
            }}
          />
          <button
            onClick={registrarGasto}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              backgroundColor: "#2563EB",
              color: "#FFF",
              border: "none",
              cursor: "pointer",
              flex: "1 1 100px"
            }}
          >
            Registrar
          </button>
        </div>

        <div style={{ overflowX: "auto", marginBottom: "15px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px"
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "2px solid #2563EB",
                    padding: "8px",
                    textAlign: "left"
                  }}
                >
                  Descrição
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #2563EB",
                    padding: "8px",
                    textAlign: "right"
                  }}
                >
                  Valor (R$)
                </th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((g) => (
                <tr key={g.id}>
                  <td style={{ padding: "8px" }}>{g.descricao}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    {g.valor.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "15px"
          }}
        >
          <button
            onClick={gerarPDF}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              backgroundColor: "#10B981",
              color: "#FFF",
              border: "none",
              cursor: "pointer",
              flex: "1 1 120px"
            }}
          >
            Gerar PDF
          </button>
          <button
            onClick={limparAssinatura}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              backgroundColor: "#EF4444",
              color: "#FFF",
              border: "none",
              cursor: "pointer",
              flex: "1 1 120px"
            }}
          >
            Limpar Assinatura
          </button>
        </div>

        <p style={{ marginBottom: "8px" }}>Assinatura:</p>
        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          style={{
            width: "100%",
            maxWidth: "100%",
            border: "2px solid #2563EB",
            borderRadius: "8px",
            backgroundColor: "#FFF",
            cursor: "crosshair",
            display: "block",
            marginBottom: "15px"
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>

        {pdfUrl && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
              Visualização do PDF:
            </h2>
            <iframe
              src={pdfUrl}
              width="100%"
              height="400"
              style={{
                border: "2px solid #2563EB",
                borderRadius: "8px",
                width: "100%"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
