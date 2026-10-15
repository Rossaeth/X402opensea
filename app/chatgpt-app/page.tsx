"use client";

import { useState } from "react";

type Result = Record<string, unknown>;

export default function ChatGPTAppPreview() {
  const [chain, setChain] = useState("base");
  const [limit, setLimit] = useState("6");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function explore() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(
        `/api/opensea/trending?chain=${encodeURIComponent(chain)}&limit=${encodeURIComponent(limit)}`
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          response.status === 402
            ? "Endpoint ini meminta pembayaran x402. Integrasi pembayaran dan verifikasi perlu disambungkan sebelum hasil berbayar bisa ditampilkan."
            : `API mengembalikan HTTP ${response.status}. Periksa konfigurasi endpoint.`
        );
        setResult(payload);
        return;
      }
      setResult(payload as Result);
    } catch {
      setError("Tidak bisa menghubungi endpoint. Coba lagi setelah API tersedia.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0d14", color: "#f5f6fb", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", padding: "24px 16px 48px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingBottom: 24, borderBottom: "1px solid #252a39" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#9a83ff,#5e8dff)", color: "#0b0d14", fontWeight: 950, fontSize: 18 }}>X</span>
            <span><strong style={{ display: "block", fontSize: 17 }}>X402 OpenSea</strong><span style={{ color: "#9098ae", fontSize: 12 }}>ChatGPT App · UI Preview</span></span>
          </a>
          <span style={{ border: "1px solid #315c4c", background: "#13291f", color: "#89e4b5", borderRadius: 999, padding: "7px 11px", fontSize: 12 }}>● Base & EVM data</span>
        </header>

        <section style={{ padding: "44px 0 30px" }}>
          <div style={{ color: "#ac9aff", textTransform: "uppercase", letterSpacing: 2, fontSize: 11, fontWeight: 800, marginBottom: 14 }}>NFT RESEARCH, INSIDE CHATGPT</div>
          <h1 style={{ fontSize: "clamp(34px, 7vw, 58px)", lineHeight: 1.03, letterSpacing: "-0.045em", maxWidth: 720, margin: "0 0 16px" }}>Explore the NFT market.<br /><span style={{ color: "#a99aff" }}>One conversation away.</span></h1>
          <p style={{ color: "#aeb5c8", fontSize: 16, lineHeight: 1.75, maxWidth: 650, margin: 0 }}>Cari koleksi yang sedang tren, periksa data NFT, dan siapkan alur transaksi dari satu antarmuka. Pembelian atau minting tetap memerlukan API aktif serta persetujuan wallet saat diperlukan.</p>
        </section>

        <section style={{ border: "1px solid #2b3042", background: "linear-gradient(145deg,#151927,#10131c)", borderRadius: 20, padding: "20px", boxShadow: "0 18px 60px #0003" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <div><h2 style={{ fontSize: 19, margin: "0 0 5px" }}>Explore trending collections</h2><p style={{ margin: 0, color: "#8f98af", fontSize: 13 }}>Ambil data melalui endpoint x402 OpenSea.</p></div>
            <span style={{ color: "#969fb4", fontSize: 12 }}>LIVE API · IF CONFIGURED</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))", gap: 12 }}>
            <label style={{ display: "grid", gap: 7, color: "#aeb5c8", fontSize: 12 }}>Network
              <select value={chain} onChange={(e) => setChain(e.target.value)} style={{ width: "100%", background: "#0b0d14", color: "#f5f6fb", border: "1px solid #353b50", borderRadius: 10, padding: 12 }}>
                <option value="base">Base</option><option value="ethereum">Ethereum</option><option value="polygon">Polygon</option><option value="arbitrum">Arbitrum</option><option value="optimism">Optimism</option>
              </select>
            </label>
            <label style={{ display: "grid", gap: 7, color: "#aeb5c8", fontSize: 12 }}>Number of results
              <select value={limit} onChange={(e) => setLimit(e.target.value)} style={{ width: "100%", background: "#0b0d14", color: "#f5f6fb", border: "1px solid #353b50", borderRadius: 10, padding: 12 }}>
                <option value="3">3 collections</option><option value="6">6 collections</option><option value="10">10 collections</option>
              </select>
            </label>
            <div style={{ display: "flex", alignItems: "end" }}><button onClick={explore} disabled={loading} style={{ width: "100%", border: 0, borderRadius: 10, padding: 13, background: loading ? "#514b70" : "#a99aff", color: "#10111a", fontWeight: 850, cursor: loading ? "wait" : "pointer" }}>{loading ? "Loading…" : "Explore collections ↗"}</button></div>
          </div>
          {error && <div role="alert" style={{ marginTop: 16, border: "1px solid #70464c", background: "#29171d", color: "#ffc0c8", borderRadius: 10, padding: 13, fontSize: 13, lineHeight: 1.6 }}>{error}</div>}
          {result && <div style={{ marginTop: 18, border: "1px solid #2c3345", background: "#0b0d14", borderRadius: 12, padding: 14 }}>
            <div style={{ color: "#a99aff", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>API RESPONSE</div>
            <pre style={{ margin: 0, color: "#c8d1e7", whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 440, overflow: "auto", fontSize: 12, lineHeight: 1.65 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 12, marginTop: 16 }}>
          {[
            ["01", "Research", "Trending, collection details, floor prices, listings, and activity."],
            ["02", "Review transactions", "Prepare buy or sell actions, then review and sign with your wallet."],
            ["03", "Create NFT", "Open the NFT studio to upload artwork and prepare minting."],
          ].map(([number, title, description]) => <article key={number} style={{ border: "1px solid #272c3d", borderRadius: 15, padding: 17, background: "#11141e" }}>
            <div style={{ color: "#a99aff", fontSize: 11, fontWeight: 900, letterSpacing: 1.5, marginBottom: 12 }}>{number} / X402</div>
            <h3 style={{ fontSize: 16, margin: "0 0 8px" }}>{title}</h3><p style={{ color: "#969fb4", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{description}</p>
            {number === "03" && <a href="/mint" style={{ display: "inline-block", marginTop: 13, color: "#c4baff", fontSize: 13, fontWeight: 750 }}>Open NFT Studio ↗</a>}
          </article>)}
        </section>
        <footer style={{ marginTop: 30, borderTop: "1px solid #252a39", paddingTop: 18, color: "#707990", fontSize: 12, lineHeight: 1.7 }}>UI preview for the future ChatGPT app. This page is not yet an installed or published ChatGPT plugin. Live data depends on working API routes and x402 payment verification. Never enter a seed phrase or private key here.</footer>
      </div>
    </main>
  );
}
