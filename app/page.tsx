"use client";
import { useState } from "react";

const networks = [
  { id: "base", name: "Base", chain: "Base Mainnet", note: "USDC · EVM", color: "#1652f0" },
  { id: "solana", name: "Solana", chain: "Solana Mainnet", note: "USDC · SVM", color: "#8056e8" },
  { id: "arc", name: "Arc", chain: "Arc Testnet", note: "USDC · testnet", color: "#168d79" },
];
const items = [
  { name: "Genesis Ocean", creator: "studio.rossa", art: "ocean" },
  { name: "Pixel Bloom", creator: "pixelgarden", art: "bloom" },
  { name: "Orbit No. 8", creator: "orbitalworks", art: "orbit" },
];

export default function Home() {
  const [network, setNetwork] = useState("base");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function tryAccess() {
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/paid", { headers: { accept: "application/json" } });
      const body = await response.json().catch(() => ({}));
      if (response.status === 402) setStatus("Payment required. Use an x402-compatible wallet/client to submit a signed payment.");
      else if (response.ok) setStatus("Server returned access. Verify the payment response before treating it as paid.");
      else setStatus(body.error || "Paid access is not configured yet. No payment was confirmed.");
    } catch { setStatus("Could not reach the payment endpoint. No payment was confirmed."); }
    finally { setBusy(false); }
  }
  return <main>
    <header className="topbar"><a className="brand" href="/"><span className="mark">✳</span>x402<span className="light">opensea</span></a><nav><a href="#explore">Explore</a><a href="#how">How it works</a><a href="#api">Developers</a></nav><a className="nav-button" href="#payment">Choose payment ↗</a></header>
    <section className="hero"><div><div className="eyebrow">✳ &nbsp; INTERNET-NATIVE COLLECTIBLES</div><h1>Collect culture.<br/><em>Pay per item.</em></h1><p className="lead">A new kind of marketplace built for the open internet. Explore digital collectibles and access items with x402 stablecoin micropayments.</p><div className="actions"><a className="primary" href="#explore">Explore collection ↘</a><a href="#how">How x402 works →</a></div><p className="footnote">◇ Non-custodial by design &nbsp; · &nbsp; Server-verified payments</p></div><div className="hero-art"><div className="orbit one"></div><div className="orbit two"></div><div className="sphere"></div><div className="art-caption"><span>COLLECTION 001</span><strong>Beyond the blue</strong><span>01 / 03</span></div><span className="chip">✳ &nbsp; Onchain access</span></div></section>
    <div className="ticker">BUILT ON OPEN PAYMENTS　 ✳　 BASE　 ✳　 SOLANA　 ✳　 ARC TESTNET　 ✳　 POWERED BY x402 V2</div>
    <section className="section" id="explore"><div className="section-head"><div><div className="eyebrow">THE CURATED DROP</div><h2>Small pieces of <em>the internet.</em></h2></div><a href="#payment">View payment options ↗</a></div><div className="items">{items.map((item, i) => <article className="item" key={item.name}><div className={"item-art " + item.art}><span className="index">/0{i+1}</span><span className="tag">Digital collectible</span><div className="shape"></div></div><div className="item-info"><div><h3>{item.name}</h3><p>Created by {item.creator}</p></div><strong>0.01 <small>USDC</small></strong></div><button className="item-button" onClick={tryAccess} disabled={busy}>{busy ? "Checking…" : "Unlock item"} <span>↗</span></button></article>)}</div><p className="demo-note">Demo collection · Placeholder artwork and prices · No NFT ownership or payment is implied.</p></section>
    <section className="payment" id="payment"><div className="payment-copy"><div className="eyebrow">ONE PRICE. YOUR NETWORK.</div><h2>Pay your way<br/><em>across chains.</em></h2><p>Choose a network for the 0.01 USDC demo item. Payment is only complete after the server verifies and settles it through a supported x402 facilitator.</p><p className="secure">✓ &nbsp; No fake success states. Ever.</p></div><div className="panel"><div className="panel-head"><span>PAYMENT METHOD</span><span className="protocol">x402 V2</span></div><div className="network-list">{networks.map(n => <button key={n.id} className={"network " + (network === n.id ? "selected" : "")} onClick={() => {setNetwork(n.id);setStatus("");}}><span className="network-icon" style={{background:n.color}}>{n.id === "base" ? "◉" : n.id === "solana" ? "≋" : "◈"}</span><span className="network-name"><strong>{n.name}</strong><small>{n.note}</small></span><span className="chain">{n.chain}</span><span className="radio">{network === n.id ? "✓" : ""}</span></button>)}</div><div className="amount"><span>Item access</span><strong>0.01 <small>USDC</small></strong></div><div className="amount muted"><span>Network</span><strong>{networks.find(n=>n.id===network)?.chain}</strong></div>{network === "arc" && <p className="warning">Arc is shown as testnet until the target network, USDC asset and facilitator support are configured. Do not send mainnet funds.</p>}<button className="pay-button" onClick={tryAccess} disabled={busy}>{busy ? "Checking endpoint…" : "Continue to secure payment"} <span>↗</span></button>{status && <p className="status" role="status">{status}</p>}<p className="disclaimer">This demo does not request a wallet signature by itself. Payments remain disabled until the server and facilitator are configured.</p></div></section>
    <section className="section how" id="how"><div className="eyebrow">A BETTER INTERNET ECONOMY</div><h2>Simple for people.<br/><em>Native to the web.</em></h2><div className="steps"><article><span>01</span><h3>Choose an item</h3><p>Find a digital collectible or resource you want to access.</p></article><article><span>02</span><h3>Authorize payment</h3><p>Your x402-compatible client signs a payment for the selected network.</p></article><article><span>03</span><h3>Server verifies</h3><p>The server checks payment with a supported facilitator before unlocking content.</p></article></div></section>
    <section className="developers" id="api"><div><div className="eyebrow">BUILD WITH x402</div><h2>Payments belong<br/>in the protocol.</h2><p>Inspect the live status endpoint and integrate pay-per-request access in your own app.</p></div><div className="code"><div className="code-head">●　●　●　 GET /api/status</div><pre>{JSON.stringify({protocol:"x402 v2",price:"0.01 USDC",networks:["Base","Solana","Arc Testnet"],verification:"server-side only"},null,2)}</pre><a href="/api/status" target="_blank" rel="noreferrer">Open status endpoint ↗</a></div></section>
    <footer><a className="brand" href="/"><span className="mark">✳</span>x402<span className="light">opensea</span></a><span>Open internet. Open payments.</span><span>Demo marketplace · x402 v2 concept</span></footer>
  </main>;
}
