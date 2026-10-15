"use client";
import { useEffect, useState } from "react";

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
  const [liveCollections, setLiveCollections] = useState<Array<{name:string;slug:string|null;imageUrl:string|null;description:string|null;openseaUrl:string|null;chain:string}>>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/opensea/collections?chain=base&limit=6")
      .then(async response => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "OpenSea collections are unavailable.");
        if (active) setLiveCollections(data.collections || []);
      })
      .catch(error => { if (active) setCollectionsError(error instanceof Error ? error.message : "OpenSea data is unavailable."); })
      .finally(() => { if (active) setCollectionsLoading(false); });
    return () => { active = false; };
  }, []);

  const displayItems = liveCollections.length
    ? liveCollections.map((item, i) => ({
        name: item.name, creator: item.chain, art: ["ocean", "bloom", "orbit"][i % 3],
        imageUrl: item.imageUrl, openseaUrl: item.openseaUrl, isLive: true
      }))
    : items.map(item => ({ ...item, imageUrl: null, openseaUrl: null, isLive: false }));
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
    <section className="section" id="explore"><div className="section-head"><div><div className="eyebrow">THE CURATED DROP</div><h2>Small pieces of <em>the internet.</em></h2></div><a href="#payment">View payment options ↗</a></div><div className="items">{displayItems.map((item, i) => <article className="item" key={item.name}><div className={"item-art " + item.art} style={item.imageUrl ? {backgroundImage: `url("${item.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center"} : undefined}><span className="index">/0{i+1}</span><span className="tag">{item.isLive ? "OpenSea collection" : "Demo collectible"}</span>{!item.imageUrl && <div className="shape"></div>}</div><div className="item-info"><div><h3>{item.name}</h3><p>{item.isLive ? `OpenSea · ${item.creator}` : `Created by ${item.creator}`}</p></div><strong>0.01 <small>USDC</small></strong></div>{item.isLive && item.openseaUrl ? <a className="item-button" href={item.openseaUrl} target="_blank" rel="noreferrer">View on OpenSea <span>↗</span></a> : <button className="item-button" onClick={tryAccess} disabled={busy}>{busy ? "Checking…" : "Unlock demo item"} <span>↗</span></button>}</article>)}</div><p className="demo-note">{collectionsLoading ? "Connecting to OpenSea…" : liveCollections.length ? `Live collection data loaded from OpenSea API v2 on Base (${liveCollections.length} shown). Displayed price is illustrative, not a live listing.` : `OpenSea data is not available right now${collectionsError ? `: ${collectionsError}` : ""}. Showing clearly labeled demo items instead. Prices are illustrative; no NFT ownership or payment is implied.`}</p></section>
    <section className="payment" id="payment"><div className="payment-copy"><div className="eyebrow">ONE PRICE. YOUR NETWORK.</div><h2>Pay your way<br/><em>across chains.</em></h2><p>Choose a network for the 0.01 USDC demo item. Payment is only complete after the server verifies and settles it through a supported x402 facilitator.</p><p className="secure">✓ &nbsp; No fake success states. Ever.</p></div><div className="panel"><div className="panel-head"><span>PAYMENT METHOD</span><span className="protocol">x402 V2</span></div><div className="network-list">{networks.map(n => <button key={n.id} className={"network " + (network === n.id ? "selected" : "")} onClick={() => {setNetwork(n.id);setStatus("");}}><span className="network-icon" style={{background:n.color}}>{n.id === "base" ? "◉" : n.id === "solana" ? "≋" : "◈"}</span><span className="network-name"><strong>{n.name}</strong><small>{n.note}</small></span><span className="chain">{n.chain}</span><span className="radio">{network === n.id ? "✓" : ""}</span></button>)}</div><div className="amount"><span>Item access</span><strong>0.01 <small>USDC</small></strong></div><div className="amount muted"><span>Network</span><strong>{networks.find(n=>n.id===network)?.chain}</strong></div>{network === "arc" && <p className="warning">Arc is shown as testnet until the target network, USDC asset and facilitator support are configured. Do not send mainnet funds.</p>}<button className="pay-button" onClick={tryAccess} disabled={busy}>{busy ? "Checking endpoint…" : "Continue to secure payment"} <span>↗</span></button>{status && <p className="status" role="status">{status}</p>}<p className="disclaimer">This demo does not request a wallet signature by itself. Payments remain disabled until the server and facilitator are configured.</p></div></section>
    <section className="section how" id="how"><div className="eyebrow">A BETTER INTERNET ECONOMY</div><h2>Simple for people.<br/><em>Native to the web.</em></h2><div className="steps"><article><span>01</span><h3>Choose an item</h3><p>Find a digital collectible or resource you want to access.</p></article><article><span>02</span><h3>Authorize payment</h3><p>Your x402-compatible client signs a payment for the selected network.</p></article><article><span>03</span><h3>Server verifies</h3><p>The server checks payment with a supported facilitator before unlocking content.</p></article></div></section>
    <section className="developers" id="api">
      <div>
        <div className="eyebrow">DEVELOPER API DIRECTORY</div>
        <h2>Explore the<br/>available endpoints.</h2>
        <p>Use these HTTP GET endpoints to inspect OpenSea collection data, check service configuration, discover x402 resources, and read the API contract. Open each endpoint to see its JSON response.</p>
      </div>
      <div className="code">
        <div className="code-head">✳　 LIVE API ENDPOINTS</div>
        <div style={{display:"grid",gap:"12px",padding:"18px 0"}}>
          <div style={{borderBottom:"1px solid #343434",paddingBottom:"12px"}}>
            <span className="protocol">GET · OPENSEA DATA</span>
            <p style={{margin:"8px 0 4px",fontWeight:700}}>Collections</p>
            <p style={{fontSize:"13px",overflowWrap:"anywhere"}}>/api/opensea/collections?chain=base&amp;limit=6</p>
            <p style={{fontSize:"13px",opacity:.75}}>Fetch collection names, image URLs, descriptions and OpenSea links. Chains: ethereum, base, polygon, arbitrum, optimism, solana. Limit: 1–20.</p>
            <a href="/api/opensea/collections?chain=base&limit=6" target="_blank" rel="noreferrer">Try collections endpoint ↗</a>
          </div>
          <div style={{borderBottom:"1px solid #343434",paddingBottom:"12px"}}>
            <span className="protocol">GET · SERVICE STATUS</span>
            <p style={{margin:"8px 0 4px",fontWeight:700}}>Payment configuration</p>
            <p style={{fontSize:"13px"}}>/api/status</p>
            <p style={{fontSize:"13px",opacity:.75}}>Inspect configured facilitator/network flags and the demo price. This is configuration status, not proof that a payment has settled.</p>
            <a href="/api/status" target="_blank" rel="noreferrer">Try status endpoint ↗</a>
          </div>
          <div style={{borderBottom:"1px solid #343434",paddingBottom:"12px"}}>
            <span className="protocol">GET · x402 PAYMENT</span>
            <p style={{margin:"8px 0 4px",fontWeight:700}}>Paid demo resource</p>
            <p style={{fontSize:"13px"}}>/api/paid</p>
            <p style={{fontSize:"13px",opacity:.75}}>Requests access to demo content at 0.01 USDC. A client should handle the HTTP 402 payment challenge. Not an NFT mint or ownership check.</p>
            <a href="/api/paid" target="_blank" rel="noreferrer">Try paid endpoint ↗</a>
          </div>
          <div style={{borderBottom:"1px solid #343434",paddingBottom:"12px"}}>
            <span className="protocol">GET · API SCHEMA</span>
            <p style={{margin:"8px 0 4px",fontWeight:700}}>OpenAPI specification</p>
            <p style={{fontSize:"13px"}}>/openapi.json</p>
            <p style={{fontSize:"13px",opacity:.75}}>Read the machine-readable API contract, operations, and response definitions.</p>
            <a href="/openapi.json" target="_blank" rel="noreferrer">Open OpenAPI JSON ↗</a>
          </div>
          <div>
            <span className="protocol">GET · RESOURCE DISCOVERY</span>
            <p style={{margin:"8px 0 4px",fontWeight:700}>x402 discovery</p>
            <p style={{fontSize:"13px"}}>{"/.well-known/x402"}</p>
            <p style={{fontSize:"13px",opacity:.75}}>Discover the resource protected by x402 and its general payment instructions.</p>
            <a href="/.well-known/x402" target="_blank" rel="noreferrer">Open discovery JSON ↗</a>
          </div>
        </div>
        <p style={{fontSize:"12px",opacity:.7}}>All endpoints are read-only GET requests from this directory. OpenSea data requires a valid server-side OPENSEA_API_KEY. Never place API keys in browser code.</p>
      </div>
    </section>
    <footer><a className="brand" href="/"><span className="mark">✳</span>x402<span className="light">opensea</span></a><span>Open internet. Open payments.</span><span>Demo marketplace · x402 v2 concept</span></footer>
  </main>;
}
