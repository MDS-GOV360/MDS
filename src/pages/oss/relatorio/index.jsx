"use client";

import React, { useState } from "react";

export default function GeradorRelatorio() {
  const [tituloRelatorio, setTituloRelatorio] = useState("Relatorio");
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [motivos, setMotivos] = useState("");

  const [advertencias, setAdvertencias] = useState([]);
  const [observacoes, setObservacoes] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [tabelas, setTabelas] = useState([]);

  const [corCabecalho, setCorCabecalho] = useState("#FFFFFFFF");
  const [corFundo] = useState("#212121FF");
  const [corBordaFoto, setCorBordaFoto] = useState("#FFFFFFFF");
  const [fonteTitulo, setFonteTitulo] = useState("Arial");

  // Fotos
  const handleAddFoto = (event) => {
    const files = Array.from(event.target.files);
    const novos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      titulo: "",
      descricao: "",
    }));
    setFotos([...fotos, ...novos]);
  };

  const handleFotoChange = (index, field, value) => {
    const novasFotos = [...fotos];
    novasFotos[index][field] = value;
    setFotos(novasFotos);
  };

  // Advertências
  const handleAddAdvertencia = () => {
    setAdvertencias([...advertencias, { nome: "", descricao: "" }]);
  };

  const handleAdvertenciaChange = (index, field, value) => {
    const novasAdvertencias = [...advertencias];
    novasAdvertencias[index][field] = value;
    setAdvertencias(novasAdvertencias);
  };

  // Observações
  const handleAddObservacao = () => {
    setObservacoes([...observacoes, { texto: "", cuidado: false }]);
  };

  const handleObservacaoChange = (index, field, value) => {
    const novasObservacoes = [...observacoes];
    novasObservacoes[index][field] = value;
    setObservacoes(novasObservacoes);
  };

  // Tabelas
  const handleAddTabela = () => {
    setTabelas([
      ...tabelas,
      { titulo: "Nova Tabela", colunas: ["Coluna 1", "Coluna 2"], linhas: [["", ""], ["", ""]] },
    ]);
  };

  const handleTabelaChange = (tIdx, rIdx, cIdx, value) => {
    const novasTabelas = [...tabelas];
    novasTabelas[tIdx].linhas[rIdx][cIdx] = value;
    setTabelas(novasTabelas);
  };

  const handleAddLinhaTabela = (tIdx) => {
    const novasTabelas = [...tabelas];
    const colCount = novasTabelas[tIdx].colunas.length;
    novasTabelas[tIdx].linhas.push(Array(colCount).fill(""));
    setTabelas(novasTabelas);
  };

  // Gerar PDF
  const gerarPDF = async () => {
    if (typeof window === "undefined") return;
    const html2pdfModule = await import("html2pdf.js");
    const element = document.getElementById("relatorioPDF");
    html2pdfModule.default(element, {
      margin: 10,
      filename: `relatorio_${tituloRelatorio}_${nome}_${data}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        background: corFundo,
        minHeight: "100vh",
        color: "#ecf0f1",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#FFFFFFFF", marginBottom: "20px", fontSize: "2rem" }}>
        {tituloRelatorio}
      </h1>

   <div style={{ textAlign: "center", marginBottom: "30px" }}>
  <button
    style={{
      padding: "10px 20px",
      background: "#616161FF",
      color: "#ecf0f1",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
      fontWeight: "bold",
      transition: "0.3s",
    }}
    onClick={() => window.location.href = "/oss/historicos"} // aqui é sua rota
    onMouseOver={(e) => (e.currentTarget.style.background = "#1abc9c")}
    onMouseOut={(e) => (e.currentTarget.style.background = "#34495e")}
  >
    Histórico de Relatórios
  </button>
</div>


      {/* Formulário */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#4B4B4BFF",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        }}
      >
        <h3 style={{ color: "#FFFFFFFF", marginBottom: "15px" }}>Informações do Relatório</h3>
        <input
          placeholder="Título do Relatório"
          value={tituloRelatorio}
          onChange={(e) => setTituloRelatorio(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />
        <input
          placeholder="Nome do Funcionário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />
        <textarea
          placeholder="Motivos"
          value={motivos}
          onChange={(e) => setMotivos(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />

        {/* Advertências */}
        <h3 style={{ color: "#e74c3c" }}>Advertências</h3>
        {advertencias.map((adv, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "10px",
              borderRadius: "8px",
              padding: "10px",
              background: "#c0392b33",
            }}
          >
            <input
              placeholder="Nome da Advertência"
              value={adv.nome}
              onChange={(e) => handleAdvertenciaChange(idx, "nome", e.target.value)}
              style={{ width: "100%", marginBottom: "5px", padding: "8px", borderRadius: "6px", border: "none", outline: "none" }}
            />
            <textarea
              placeholder="Descrição da Advertência"
              value={adv.descricao}
              onChange={(e) => handleAdvertenciaChange(idx, "descricao", e.target.value)}
              rows={2}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "none", outline: "none" }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAdvertencia}
          style={{
            padding: "10px",
            marginBottom: "15px",
            background: "#e67e22",
            color: "#fff",
            borderRadius: "8px",
            width: "100%",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Adicionar Advertência
        </button>

        {/* Observações */}
        <h3>Observações / Cuidados</h3>
        {observacoes.map((obs, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <textarea
              placeholder="Observação"
              value={obs.texto}
              onChange={(e) => handleObservacaoChange(idx, "texto", e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: obs.cuidado ? "2px solid red" : "1px solid #bdc3c7",
                outline: "none",
              }}
            />
            <label style={{ display: "block", marginTop: "5px" }}>
              <input type="checkbox" checked={obs.cuidado} onChange={(e) => handleObservacaoChange(idx, "cuidado", e.target.checked)} />{" "}
              Cuidado (em vermelho)
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddObservacao}
          style={{
            padding: "10px",
            marginBottom: "15px",
            background: "#c0392b",
            color: "#fff",
            borderRadius: "8px",
            width: "100%",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Adicionar Observação
        </button>

        {/* Tabelas */}
        <h3>Tabelas</h3>
        {tabelas.map((tab, tIdx) => (
          <div key={tIdx} style={{ marginBottom: "10px", borderRadius: "8px", padding: "10px", background: "#3d566e" }}>
            <strong>{tab.titulo}</strong>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  {tab.colunas.map((col, cIdx) => (
                    <th key={cIdx} style={{ border: "1px solid #95a5a6", padding: "6px", background: "#1abc9c33" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tab.linhas.map((linha, rIdx) => (
                  <tr key={rIdx}>
                    {linha.map((cell, cIdx) => (
                      <td key={cIdx} style={{ border: "1px solid #95a5a6", padding: "6px" }}>
                        <input
                          value={cell}
                          onChange={(e) => handleTabelaChange(tIdx, rIdx, cIdx, e.target.value)}
                          style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "#ecf0f1" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => handleAddLinhaTabela(tIdx)}
              style={{ marginTop: "5px", padding: "8px", background: "#383838FF", color: "#fff", borderRadius: "6px", width: "100%", cursor: "pointer" }}
            >
              Adicionar Linha
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTabela}
          style={{ padding: "10px", marginBottom: "15px", background: "#393939FF", color: "#fff", borderRadius: "8px", width: "100%", fontWeight: "bold", cursor: "pointer" }}
        >
          Adicionar Tabela
        </button>

        <div style={{ marginBottom: "20px" }}>
  <h3>Fotos</h3>
  
  {/* Botão customizado */}
  <label
    style={{
      display: "inline-block",
      padding: "10px 20px",
      background: "#212121FF",
      color: "#ecf0f1",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      textAlign: "center",
      transition: "0.3s",
      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    }}
    onMouseOver={(e) => (e.currentTarget.style.background = "#FFFFFFFF")}
    onMouseOut={(e) => (e.currentTarget.style.background = "#34495e")}
  >
    Adicionar Fotos
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleAddFoto}
      style={{ display: "none" }} // esconde o input real
    />
  </label>

  {/* Lista de fotos */}
  {fotos.map((foto, idx) => (
    <div key={idx} style={{ marginBottom: "10px", marginTop: "10px" }}>
      <input
        placeholder="Título da Foto"
        value={foto.titulo}
        onChange={(e) => handleFotoChange(idx, "titulo", e.target.value)}
        style={{ width: "100%", marginBottom: "5px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", outline: "none" }}
      />
      <textarea
        placeholder="Descrição da Foto"
        value={foto.descricao}
        onChange={(e) => handleFotoChange(idx, "descricao", e.target.value)}
        rows={2}
        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", outline: "none" }}
      />
    </div>
  ))}
</div>


        <button
          onClick={gerarPDF}
          style={{ padding: "12px", width: "100%", background: "#27ae60", color: "#fff", fontWeight: "bold", borderRadius: "10px", marginTop: "20px", cursor: "pointer" }}
        >
          Gerar PDF
        </button>
      </div>

      {/* Preview */}
      <div
        id="relatorioPDF"
        style={{
          marginTop: "40px",
          padding: "25px",
          background: "#282828FF",
          color: "#ecf0f1",
          borderRadius: "15px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            borderBottom: `3px solid ${corCabecalho}`,
            paddingBottom: "10px",
          }}
        >
          <img
            src="https://raw.githubusercontent.com/MDS-GOV360/Logo-do-mds/refs/heads/main/logo%20do%20mds.png"
            alt="Logo"
            style={{ width: "150px", marginBottom: "10px" }}
          />
          <h2 style={{ color: corCabecalho, fontFamily: fonteTitulo }}>{tituloRelatorio}</h2>
          <p>
            <strong>Data:</strong> {data}
          </p>
        </div>

        <p>
          <strong>Nome:</strong> {nome}
        </p>
        <p>
          <strong>Motivos:</strong> {motivos}
        </p>

        {advertencias.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ color: "#e74c3c" }}>Advertências</h3>
            {advertencias.map((adv, idx) => (
              <div key={idx} style={{ background: "#c0392b33", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>
                <strong>{adv.nome}</strong>
                <p>{adv.descricao}</p>
              </div>
            ))}
          </div>
        )}

        {observacoes.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Observações / Cuidados</h3>
            {observacoes.map((obs, idx) => (
              <p key={idx} style={{ color: obs.cuidado ? "red" : "#ecf0f1" }}>• {obs.texto}</p>
            ))}
          </div>
        )}

        {tabelas.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {tabelas.map((tab, tIdx) => (
              <div key={tIdx} style={{ marginBottom: "20px" }}>
                <strong>{tab.titulo}</strong>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                  <thead>
                    <tr>
                      {tab.colunas.map((col, cIdx) => (
                        <th key={cIdx} style={{ border: "1px solid #95a5a6", padding: "6px", background: "#1abc9c33" }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tab.linhas.map((linha, rIdx) => (
                      <tr key={rIdx}>
                        {linha.map((cell, cIdx) => (
                          <td key={cIdx} style={{ border: "1px solid #95a5a6", padding: "6px" }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {fotos.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginTop: "20px" }}>
            {fotos.map((foto, index) => (
              <div key={index} style={{ border: `2px solid ${corBordaFoto}`, borderRadius: "8px", padding: "10px", background: "#3d566e" }}>
                <h4 style={{ textAlign: "center", color: "#232323FF", fontFamily: fonteTitulo }}>{foto.titulo}</h4>
                <img src={foto.url} alt={`Foto ${index + 1}`} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block", margin: "10px auto", borderRadius: "5px" }} />
                <p style={{ textAlign: "justify" }}>{foto.descricao}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
