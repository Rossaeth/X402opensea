"use client";

import { useEffect, useState } from "react";

type Endpoint = { path: string; title: string; description: string; example: string; price: string };

const endpoints: Endpoint[] = [
  { path: "/api/opensea/collections", title: "Collections", description: "List OpenSea collections with basic metadata.", example: "/api/opensea/collections?chain=base&limit=6", price: "Public/demo route — check response" },
  { path: "/api/opensea/trending", title: "Trending collections", description: "Discover currently trending collections.", example: "/api/opensea/trending?chain=ethereum&limit=10", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/top-collections", title: "Top collections", description: "Retrieve top-ranked collections.", example: "/api/opensea/top-collections?chain=ethereum&limit=10", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/collection-details", title: "Collection details", description: "Get metadata and details for one collection.", example: "/api/opensea/collection-details?slug=doodles-official", price: "$0.01 / request (configured price)" },
  { path: "/api/opensea/collection-stats", title: "Collection statistics", description: "Fetch collection statistics and floor-price information.", example: "/api/opensea/collection-stats?slug=doodles-official", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/floor-prices", title: "Floor prices", description: "Request floor-price data for a collection.", example: "/api/opensea/floor-prices?slug=doodles-official", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/listings", title: "Collection listings", description: "Fetch active listings for a collection.", example: "/api/opensea/listings?slug=doodles-official", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/offers", title: "Collection offers", description: "Fetch offers associated with a collection.", example: "/api/opensea/offers?slug=doodles-official", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/activity", title: "Collection activity", description: "Fetch collection events and sales activity.", example: "/api/opensea/activity?slug=doodles-official", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/nft-details", title: "NFT details", description: "Fetch NFT metadata using a chain, contract address, and token ID.", example: "/api/opensea/nft-details?chain=ethereum&contract=0x0000000000000000000000000000000000000000&token_id=1", price: "$0.01 / request (configured price)" },
  { path: "/api/opensea/wallet-nfts", title: "Wallet NFTs", description: "List NFTs owned by a wallet address.", example: "/api/opensea/wallet-nfts?address=0x0000000000000000000000000000000000000000&chain=ethereum", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/wallet-portfolio", title: "Wallet portfolio", description: "Request portfolio data for a wallet address.", example: "/api/opensea/wallet-portfolio?address=0x0000000000000000000000000000000000000000", price: "$0.03 / request (configured price)" },
  { path: "/api/opensea/wallet-listings", title: "Wallet listings", description: "Fetch listings associated with a wallet.", example: "/api/opensea/wallet-listings?address=0x0000000000000000000000000000000000000000", price: "$0.02 / request (configured price)" },
  { path: "/api/opensea/wallet-offers", title: "Wallet offers", description: "Fetch offers associated with a wallet.", example: "/api/opensea/wallet-offers?address=0x0000000000000000000000000000000000000000", price: "$0.02 / request (configured price)" },
];

export default function Home() {
  const [status, setStatus] = useState<string>("Loading service status…");
  useEffect(() => {
    fetch("/api/status")
      .then(async (r) => {
        const data = await r.json();
        setStatus(r.ok ? JSON.stringify(data, null, 2) : "Status endpoint returned an error.");
      })
      .catch(() => setStatus("Could not load status endpoint."));
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#0b0c10", color: "#f4f5f7", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #252833", padding: "22px clamp(18px, 5vw, 64px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <a href="/" style={{ color: "#fff", fontWeight: 800, fontSize: 22, textDecoration: "none" }}>x402<span style={{ color: "#9b8cff" }}>opensea</span><span style={{ color: "#7f8494", fontSize: 12, marginLeft: 10 }}>API GATEWAY</span></a>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: 14 }}>
          <a href="#endpoints" style={{ color: "#c6c9d3" }}>Endpoints</a>
          <a href="/openapi.json" style={{ color: "#c6c9d3" }}>OpenAPI JSON</a>
          <a href="/.well-known/x402" style={{ color: "#c6c9d3" }}>x402 Discovery</a>
          <a href="/api/status" style={{ color: "#c6c9d3" }}>Status JSON</a>
        </nav>
      </header>
      <section style={{ padding: "64px clamp(18px, 5vw, 64px) 42px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ color: "#a99cff", fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 18 }}>OPEN SEA DATA · HTTP API · x402</div>
        <h1 style={{ fontSize: "clamp(38px, 6vw, 68px)", letterSpacing: -2, lineHeight: 1.04, margin: "0 0 20px", maxWidth: 850 }}>OpenSea endpoints<br /><span style={{ color: "#a99cff" }}>for AI agents.</span></h1>
        <p style={{ maxWidth: 720, color: "#b4b8c5", fontSize: 17, lineHeight: 1.7 }}>A machine-readable directory for querying NFT collections, listings, offers, activity, and wallet data. Endpoint names and API descriptions are in English. Protected routes may return HTTP 402 and require a compatible x402 payment client.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
          <a href="/openapi.json" style={{ background: "#a99cff", color: "#11121a", borderRadius: 9, padding: "12px 16px", fontWeight: 800, textDecoration: "none" }}>View OpenAPI spec ↗</a>
          <a href="/.well-known/x402" style={{ border: "1px solid #424655", color: "#f4f5f7", borderRadius: 9, padding: "12px 16px", fontWeight: 700, textDecoration: "none" }}>x402 discovery ↗</a>
        </div>
      </section>
      <section id="endpoints" style={{ maxWidth: 1100, margin: "0 auto", padding: "12px clamp(18px, 5vw, 64px) 64px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <div><div style={{ color: "#9da3b5", fontSize: 12, letterSpacing: 1.5, fontWeight: 800 }}>ENDPOINT DIRECTORY</div><h2 style={{ margin: "8px 0 0", fontSize: 30 }}>Available routes</h2></div>
          <span style={{ color: "#b4b8c5", fontSize: 13 }}>{endpoints.length} OpenSea data routes</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))", gap: 14 }}>
          {endpoints.map((endpoint) => (
            <article key={endpoint.path} style={{ border: "1px solid #292d39", background: "#12141b", borderRadius: 14, padding: 18, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <span style={{ background: "#183a2d", color: "#80e2b2", borderRadius: 5, padding: "4px 7px", fontSize: 11, fontWeight: 900 }}>GET</span>
                <h3 style={{ fontSize: 17, margin: 0 }}>{endpoint.title}</h3>
              </div>
              <p style={{ color: "#b4b8c5", lineHeight: 1.5, minHeight: 44, fontSize: 14 }}>{endpoint.description}</p>
              <code style={{ display: "block", color: "#c4baff", overflowWrap: "anywhere", fontSize: 12, lineHeight: 1.6, padding: "10px 11px", background: "#0b0c10", borderRadius: 8 }}>{endpoint.example}</code>
              <p style={{ color: "#9298aa", fontSize: 12, margin: "12px 0" }}>{endpoint.price}</p>
              <a href={endpoint.example} target="_blank" rel="noreferrer" style={{ color: "#d4ccff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Open example ↗</a>
            </article>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 14, marginTop: 22 }}>
          <article style={{ border: "1px solid #292d39", borderRadius: 14, padding: 18, background: "#12141b" }}>
            <h3 style={{ marginTop: 0 }}>Service status</h3><p style={{ color: "#aeb3c1", fontSize: 14 }}>Public configuration status only; this does not prove facilitator availability or payment settlement.</p><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12, color: "#b8c2d9", maxHeight: 220, overflow: "auto" }}>{status}</pre><a href="/api/status" style={{ color: "#c4baff" }}>Open /api/status ↗</a>
          </article>
          <article style={{ border: "1px solid #292d39", borderRadius: 14, padding: 18, background: "#12141b" }}>
            <h3 style={{ marginTop: 0 }}>x402 demo resource</h3><p style={{ color: "#aeb3c1", fontSize: 14 }}>Test the payment challenge on the demo resource. A 402 response means payment is requested, not that a payment has completed.</p><code style={{ display: "block", background: "#0b0c10", padding: 10, borderRadius: 8, color: "#c4baff" }}>/api/paid</code><p><a href="/api/paid" target="_blank" rel="noreferrer" style={{ color: "#c4baff" }}>Open paid endpoint ↗</a></p>
          </article>
        </div>
        <p style={{ color: "#777e90", fontSize: 12, lineHeight: 1.6, marginTop: 24 }}>Live OpenSea data requires a valid server-side API key. Prices shown are configured/intended gateway prices, not confirmation that payment processing is currently operational. Never expose API keys in browser code.</p>
      </section>
      <footer style={{ borderTop: "1px solid #252833", padding: "24px clamp(18px, 5vw, 64px)", color: "#7f8494", fontSize: 13, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
        <span>x402opensea · API Gateway</span><span>OpenSea data proxy · x402 v2 concept</span>
      </footer>
    </main>
  );
}
