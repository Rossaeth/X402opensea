"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Collection = {
  name?: string;
  collection?: string;
  slug?: string;
  image_url?: string;
  image?: string;
  opensea_url?: string;
  description?: string;
  category?: string;
  floor_price?: number | string;
  total_volume?: number | string;
  chain?: string;
  contracts?: Array<{ chain?: string }>;
};

function findCollections(payload: unknown): Collection[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const data = (root.data && typeof root.data === "object" ? root.data : root) as Record<string, unknown>;
  const candidates = [data.collections, data.results, data.items, root.collections, root.results];
  const found = candidates.find(Array.isArray);
  return Array.isArray(found) ? found as Collection[] : [];
}

function formatNumber(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return number.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

export default function ChatGPTAppPreview() {
  const [chain, setChain] = useState("ethereum");
  const [limit, setLimit] = useState("6");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/opensea/top-collections?chain=${encodeURIComponent(chain)}&limit=${encodeURIComponent(limit)}`, { cache: "no-store" });
      const payload: unknown = await response.json().catch(() => ({}));
      if (!response.ok) {
        const body = payload as { error?: string; message?: string };
        throw new Error(body.error || body.message || `API returned HTTP ${response.status}`);
      }
      const rows = findCollections(payload);
      if (!rows.length) throw new Error("API terhubung, tetapi format data koleksi belum dikenali.");
      setCollections(rows);
      setUpdatedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat koleksi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [chain, limit]);

  useEffect(() => { void loadCollections(); }, [loadCollections]);

  const filtered = useMemo(() => collections.filter((item) => (item.name || item.collection || item.slug || "").toLowerCase().includes(query.toLowerCase())), [collections, query]);

  return (
    <main className="market">
      <div className="market-glow" />
      <div className="market-shell">
        <header className="market-nav">
          <a className="market-brand" href="/chatgpt-app" aria-label="X402 OpenSea home">
            <span className="brand-symbol">✳</span><span>X402<span className="brand-soft">SEA</span><small>NFT MARKET INTELLIGENCE</small></span>
          </a>
          <nav className="market-links"><a href="#market">Explore</a><a href="#collections">Collections</a><a href="/api/status" target="_blank" rel="noreferrer">API status ↗</a></nav>
          <span className="live-pill"><i /> LIVE DATA</span>
        </header>

        <section className="market-hero">
          <div className="hero-copy">
            <div className="eyebrow"><span>✦</span> ONCHAIN CULTURE, IN REAL TIME</div>
            <h1>Discover what’s<br /> <em>next in NFTs.</em></h1>
            <p>Explore standout collections, track the culture, and dive into the NFT market — all from one sleek workspace.</p>
            <div className="hero-actions"><a className="btn-primary" href="#collections">Explore collections <span>↘</span></a><span className="free-note"><span>●</span> Free while in development</span></div>
          </div>
          <div className="hero-art" aria-label="Abstract NFT artwork">
            <div className="art-grid" /><div className="art-orbit orbit-a" /><div className="art-orbit orbit-b" />
            <div className="art-gem"><span>✳</span></div><div className="art-float float-one">DIGITAL<br />COLLECTIBLES</div><div className="art-float float-two">ONCHAIN / 2026</div>
            <div className="art-bottom"><span>THE NEW COLLECTOR ERA</span><span>01 — 04</span></div>
          </div>
        </section>

        <section className="market-stats" id="market">
          <div><span className="stat-label">MARKET ACCESS</span><strong>Multi-chain</strong><small>Explore across supported networks</small></div>
          <div><span className="stat-label">DATA SOURCE</span><strong>OpenSea API</strong><small>Collection metadata and market data</small></div>
          <div><span className="stat-label">PAYMENT MODE</span><strong className="free-stat"><i /> Free mode</strong><small>x402 payments currently disabled</small></div>
        </section>

        <section className="collection-section" id="collections">
          <div className="section-heading">
            <div><div className="eyebrow">THE MARKET BOARD <span> / 01</span></div><h2>Collections to watch<span>.</span></h2><p>Fresh collection data, rendered as a visual market board.</p></div>
            <button className="refresh-btn" onClick={() => void loadCollections()} disabled={loading}>{loading ? <span className="spinner" /> : "↻"} Refresh data</button>
          </div>

          <div className="toolbar">
            <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search collections..." /></label>
            <div className="toolbar-controls">
              <label className="select-wrap"><span>NETWORK</span><select value={chain} onChange={(e) => setChain(e.target.value)}><option value="ethereum">Ethereum</option><option value="base">Base</option><option value="polygon">Polygon</option><option value="arbitrum">Arbitrum</option><option value="optimism">Optimism</option></select></label>
              <label className="select-wrap"><span>SHOW</span><select value={limit} onChange={(e) => setLimit(e.target.value)}><option value="3">3 items</option><option value="6">6 items</option><option value="10">10 items</option></select></label>
            </div>
          </div>

          {error && <div className="error-panel"><strong>Couldn’t load the market board</strong><p>{error}</p><button onClick={() => void loadCollections()}>Try again ↗</button></div>}
          {!error && loading && <div className="loading-grid">{[1,2,3,4,5,6].map((n) => <div className="skeleton-card" key={n}><div /><span /><span /></div>)}</div>}
          {!error && !loading && filtered.length === 0 && <div className="empty-state">No collections match “{query}”. Try another search.</div>}
          {!error && !loading && filtered.length > 0 && <div className="collection-grid">
            {filtered.map((item, index) => {
              const name = item.name || item.collection || item.slug || "Untitled collection";
              const slug = item.slug || "";
              const image = item.image_url || item.image;
              const network = item.chain || item.contracts?.[0]?.chain || chain;
              const url = item.opensea_url || (slug ? `https://opensea.io/collection/${slug}` : "https://opensea.io");
              const floor = formatNumber(item.floor_price);
              const volume = formatNumber(item.total_volume);
              return <article className="collection-card" key={slug || name + index}>
                <a className="collection-image" href={url} target="_blank" rel="noreferrer" aria-label={`View ${name} on OpenSea`}>
                  {image ? <img src={image} alt={name} loading={index > 2 ? "lazy" : "eager"} onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <div className={`art-placeholder placeholder-${index % 4}`}><span>✳</span></div>}
                  <span className="rank-badge">#{String(index + 1).padStart(2, "0")}</span><span className="image-arrow">↗</span>
                </a>
                <div className="collection-details">
                  <div className="collection-title"><div><h3>{name}</h3><p>{item.category || "DIGITAL COLLECTIBLE"}</p></div><span className="chain-badge">{network}</span></div>
                  <div className="collection-metrics">
                    <div><span>FLOOR PRICE</span><strong>{floor ? floor : "—"} <small>{floor ? "ETH" : "Not provided"}</small></strong></div>
                    <div><span>TOTAL VOLUME</span><strong>{volume ? volume : "—"} <small>{volume ? "ETH" : "Not provided"}</small></strong></div>
                  </div>
                  <a className="view-collection" href={url} target="_blank" rel="noreferrer">View collection <span>↗</span></a>
                </div>
              </article>;
            })}
          </div>}
          <div className="board-foot"><span>{filtered.length} collections displayed</span><span>{updatedAt ? `LAST UPDATED ${updatedAt}` : "LIVE API CONNECTION"} · SOURCE: OPENSEA</span></div>
        </section>

        <section className="bottom-banner"><div><div className="eyebrow">BUILT FOR THE NEXT WAVE</div><h2>Research first.<br /><em>Collect with clarity.</em></h2><p>Discover assets, inspect collection details, and open the original listing on OpenSea when you’re ready.</p></div><div className="banner-mark">✳</div></section>
        <footer className="market-footer"><a className="market-brand" href="/chatgpt-app"><span className="brand-symbol">✳</span><span>X402<span className="brand-soft">SEA</span><small>NFT MARKET INTELLIGENCE</small></span></a><span>OpenSea data · x402-ready architecture</span><span>Never share your seed phrase or private key.</span></footer>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        :global(*){box-sizing:border-box}:global(html){scroll-behavior:smooth}:global(body){margin:0;background:#080b0d;color:#f0f2ee;font-family:'DM Sans',sans-serif}
        .market{min-height:100vh;background:#080b0d;color:#f0f2ee;position:relative;overflow:hidden;padding:0 22px 24px}.market-glow{position:absolute;pointer-events:none;width:780px;height:600px;top:-330px;left:calc(50% - 390px);background:radial-gradient(ellipse,#9cff6c12,transparent 70%)}.market-shell{position:relative;max-width:1200px;margin:0 auto}
        .market-nav{height:82px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff13;gap:18px}.market-brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:#f5f6f2;font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:-.8px;font-size:19px}.brand-symbol{display:grid;place-items:center;width:39px;height:39px;background:#b6ff77;color:#10180c;border-radius:12px;font-size:23px}.brand-soft{color:#b6ff77}.market-brand small{display:block;color:#777f79;font:8px 'DM Mono',monospace;letter-spacing:1.15px;margin-top:2px}.market-links{display:flex;gap:28px}.market-links a{font-size:12px;color:#9ba39c;text-decoration:none}.market-links a:hover{color:#c2ff91}.live-pill{font:9px 'DM Mono',monospace;letter-spacing:.6px;border:1px solid #31422d;border-radius:50px;padding:9px 12px;color:#b6ff77;white-space:nowrap}.live-pill i,.free-stat i{display:inline-block;width:6px;height:6px;background:#b6ff77;border-radius:50%;margin-right:7px;box-shadow:0 0 12px #b6ff7780}
        .market-hero{display:grid;grid-template-columns:1.03fr .97fr;gap:54px;align-items:center;padding:70px 0 58px}.eyebrow{font:10px 'DM Mono',monospace;letter-spacing:1.6px;color:#a9b3a7}.eyebrow>span{color:#b6ff77}.hero-copy h1{font:500 clamp(47px,6vw,76px)/.99 'Space Grotesk',sans-serif;letter-spacing:-4.5px;margin:24px 0 19px}.hero-copy h1 em,.bottom-banner h2 em{font-style:normal;color:#b6ff77}.hero-copy>p,.bottom-banner p{font-size:14px;line-height:1.85;color:#929b94;max-width:445px}.hero-actions{display:flex;align-items:center;gap:22px;flex-wrap:wrap;margin-top:29px}.btn-primary{background:#b6ff77;color:#10180c;padding:14px 17px;border-radius:7px;text-decoration:none;font-size:12px;font-weight:700}.btn-primary span{margin-left:16px}.free-note{font-size:10px;color:#8f998f}.free-note span{color:#b6ff77;margin-right:6px}
        .hero-art{height:350px;position:relative;overflow:hidden;border:1px solid #ffffff19;border-radius:14px;background:radial-gradient(ellipse at 50% 48%,#42583b 0,#1b3025 35%,#0e1714 72%)}.art-grid{position:absolute;inset:0;opacity:.17;background-image:linear-gradient(#b6ff7730 1px,transparent 1px),linear-gradient(90deg,#b6ff7730 1px,transparent 1px);background-size:29px 29px;mask-image:linear-gradient(transparent,#000 25%,#000 80%,transparent)}.art-orbit{position:absolute;left:50%;top:46%;border:1px solid #caffaa80;border-radius:50%;transform:translate(-50%,-50%) rotate(-30deg);width:350px;height:120px}.orbit-b{width:290px;height:220px;transform:translate(-50%,-50%) rotate(50deg);border-color:#d8ffbd40}.art-gem{position:absolute;width:154px;height:154px;left:calc(50% - 77px);top:calc(46% - 77px);display:grid;place-items:center;border-radius:38px;transform:rotate(45deg);background:linear-gradient(140deg,#e1ffc5,#a1ed6d 32%,#4b7d37 68%,#1c3520);box-shadow:inset -20px -20px 35px #0b1a0b90,0 0 70px #a7ff6640}.art-gem span{transform:rotate(-45deg);font-size:58px;color:#10210b;text-shadow:0 1px 0 #e4ffd1}.art-float{position:absolute;font:9px/1.6 'DM Mono',monospace;letter-spacing:1px;color:#e5f5dd;background:#0a130fc9;border:1px solid #d5ffbd30;padding:10px 12px;border-radius:6px}.float-one{top:24px;left:20px}.float-two{right:20px;top:45px}.art-bottom{position:absolute;bottom:17px;left:20px;right:20px;display:flex;justify-content:space-between;color:#91a38a;font:9px 'DM Mono',monospace;letter-spacing:1px}
        .market-stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #ffffff15;border-radius:10px;background:#ffffff04;margin-bottom:78px}.market-stats>div{padding:21px 25px;border-right:1px solid #ffffff15;display:grid;gap:8px}.market-stats>div:last-child{border-right:0}.stat-label{font:9px 'DM Mono',monospace;letter-spacing:1.3px;color:#737d74}.market-stats strong{font:500 20px 'Space Grotesk',sans-serif}.market-stats small{font-size:10px;color:#7f8980}.free-stat{color:#b6ff77}
        .collection-section{scroll-margin-top:25px}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:22px;margin-bottom:28px}.section-heading h2{font:500 clamp(30px,4vw,43px)/1.1 'Space Grotesk',sans-serif;letter-spacing:-1.8px;margin:13px 0 8px}.section-heading h2 span{color:#b6ff77}.section-heading p{font-size:12px;color:#858f86;margin:0}.refresh-btn{border:1px solid #343e34;border-radius:7px;background:#101612;color:#c6d1c3;padding:12px 14px;font-size:11px;white-space:nowrap}.refresh-btn:disabled{opacity:.7}.spinner{display:inline-block;width:11px;height:11px;border:1px solid #586d4d;border-top-color:#b6ff77;border-radius:50%;animation:spin .8s linear infinite;vertical-align:middle;margin-right:7px}@keyframes spin{to{transform:rotate(360deg)}}
        .toolbar{display:flex;justify-content:space-between;gap:14px;margin-bottom:21px;padding:12px;border:1px solid #ffffff13;background:#ffffff04;border-radius:9px}.search-box{display:flex;align-items:center;gap:10px;flex:1;max-width:440px;color:#88948a;padding:0 8px}.search-box>span{font-size:23px}.search-box input{background:transparent;border:0;outline:none;color:#f0f2ee;width:100%;font:12px 'DM Sans',sans-serif}.search-box input::placeholder{color:#606a61}.toolbar-controls{display:flex;gap:10px}.select-wrap{display:grid;gap:4px;padding:3px 8px;border-left:1px solid #ffffff12}.select-wrap>span{font:8px 'DM Mono',monospace;letter-spacing:1px;color:#727e73}.select-wrap select{border:0;outline:0;background:#111712;color:#e5ece2;font:11px 'DM Sans',sans-serif;min-width:100px}
        .collection-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px}.collection-card{border:1px solid #ffffff16;border-radius:10px;overflow:hidden;background:#0e1210;transition:transform .2s,border-color .2s}.collection-card:hover{transform:translateY(-4px);border-color:#9fe86d70}.collection-image{height:230px;position:relative;display:block;overflow:hidden;background:#19221a}.collection-image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .45s}.collection-card:hover .collection-image img{transform:scale(1.04)}.rank-badge{position:absolute;top:12px;left:12px;padding:6px 8px;background:#07100dc9;border:1px solid #ffffff20;border-radius:5px;color:#e3f4da;font:9px 'DM Mono',monospace}.image-arrow{position:absolute;right:12px;top:12px;width:29px;height:29px;display:grid;place-items:center;border-radius:50%;background:#07100dc9;border:1px solid #ffffff24;color:#b6ff77}.art-placeholder{width:100%;height:100%;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#8ab56d,#29452b 55%,#111b15)}.art-placeholder span{font-size:90px;color:#c9ffab;text-shadow:0 0 55px #b6ff77}.placeholder-1{background:radial-gradient(circle at 50% 40%,#ba947c,#53382e 55%,#1a1311)}.placeholder-2{background:radial-gradient(circle at 50% 40%,#89b4bd,#304a5a 55%,#10181e)}.placeholder-3{background:radial-gradient(circle at 50% 40%,#b7a0df,#5a426e 55%,#191320)}
        .collection-details{padding:15px}.collection-title{display:flex;align-items:start;justify-content:space-between;gap:9px}.collection-title h3{font:600 15px 'Space Grotesk',sans-serif;margin:0 0 6px;overflow-wrap:anywhere}.collection-title p{font:8px 'DM Mono',monospace;letter-spacing:.9px;color:#7f8b7f;margin:0}.chain-badge{font:8px 'DM Mono',monospace;color:#c7eab4;background:#1b2b1b;border:1px solid #30452d;border-radius:4px;padding:5px 6px;white-space:nowrap}.collection-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:15px 0;margin-top:10px;border-bottom:1px solid #ffffff13;border-top:1px solid #ffffff13}.collection-metrics>div{display:grid;gap:7px;min-width:0}.collection-metrics>div>span{font:8px 'DM Mono',monospace;letter-spacing:.7px;color:#727e73}.collection-metrics strong{font:500 12px 'DM Mono',monospace;color:#dce8d8;overflow-wrap:anywhere}.collection-metrics strong small{font:9px 'DM Sans',sans-serif;color:#778378}.view-collection{display:flex;justify-content:space-between;align-items:center;padding-top:13px;color:#b6ff77;text-decoration:none;font-size:11px;font-weight:600}.view-collection span{font-size:15px}.loading-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px}.skeleton-card{border:1px solid #ffffff10;border-radius:10px;padding:10px;background:#0e1210}.skeleton-card div{height:210px;border-radius:6px;background:linear-gradient(100deg,#151c16 20%,#222d22 40%,#151c16 60%);background-size:200% 100%;animation:shimmer 1.5s infinite}.skeleton-card span{display:block;height:10px;margin:15px 4px 0;width:68%;border-radius:4px;background:#202920}.skeleton-card span:last-child{width:42%;margin-top:9px}@keyframes shimmer{to{background-position:-200% 0}}.error-panel,.empty-state{border:1px solid #543b35;background:#1b1411;border-radius:9px;padding:22px;color:#ffcfb8}.error-panel p{font-size:12px;color:#d0a99b}.error-panel button{background:#ffcfb8;border:0;border-radius:5px;padding:9px 12px;font-size:11px}.empty-state{border-color:#29372a;background:#101711;color:#aebda8;text-align:center}
        .board-foot{display:flex;justify-content:space-between;gap:15px;margin-top:22px;padding:14px 0;border-top:1px solid #ffffff13;color:#707c71;font:9px 'DM Mono',monospace;letter-spacing:.5px}.bottom-banner{display:flex;justify-content:space-between;align-items:center;gap:25px;margin-top:80px;padding:35px 38px;border:1px solid #b6ff7720;border-radius:12px;background:radial-gradient(ellipse at 80% 50%,#a9ff6b13,transparent 45%),#0d120e}.bottom-banner h2{font:500 32px/1.12 'Space Grotesk',sans-serif;letter-spacing:-1.2px;margin:14px 0 8px}.bottom-banner p{font-size:12px;max-width:490px;margin-bottom:0}.banner-mark{width:100px;height:100px;display:grid;place-items:center;border:1px solid #b6ff7730;border-radius:28px;transform:rotate(15deg);font-size:60px;color:#b6ff77;flex-shrink:0;background:#b6ff7708}.market-footer{display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap;padding:27px 0 0;margin-top:25px;color:#707b71;font-size:9px}.market-footer .market-brand{font-size:15px}.market-footer .brand-symbol{width:31px;height:31px;border-radius:9px;font-size:18px}.market-footer .market-brand small{font-size:7px}
        @media(max-width:850px){.market-hero{gap:25px;padding:55px 0}.hero-art{height:300px}.market-stats>div{padding:17px}.collection-image{height:190px}.collection-grid,.loading-grid{gap:12px}.collection-details{padding:12px}.collection-title{flex-direction:column}.collection-metrics{grid-template-columns:1fr}.collection-metrics>div{grid-template-columns:1fr auto;align-items:center}.collection-metrics strong{font-size:11px}}
        @media(max-width:620px){.market{padding:0 15px 20px}.market-nav{height:70px}.market-brand{font-size:16px;gap:8px}.brand-symbol{width:33px;height:33px;border-radius:10px;font-size:20px}.market-brand small{font-size:7px;letter-spacing:.7px}.market-links{display:none}.live-pill{font-size:8px;padding:8px}.market-hero{grid-template-columns:1fr;gap:28px;padding:46px 0 35px}.hero-copy h1{font-size:56px;letter-spacing:-3px}.hero-copy>p{font-size:13px}.hero-art{height:270px}.art-gem{width:125px;height:125px;left:calc(50% - 62px);top:calc(46% - 62px)}.art-gem span{font-size:48px}.market-stats{grid-template-columns:1fr;margin-bottom:58px}.market-stats>div{border-right:0;border-bottom:1px solid #ffffff15;padding:15px 18px}.market-stats>div:last-child{border-bottom:0}.market-stats strong{font-size:17px}.market-stats small{font-size:9px}.section-heading{align-items:start;flex-direction:column}.section-heading h2{font-size:34px}.toolbar{flex-direction:column;padding:10px}.search-box{min-height:35px;max-width:none}.toolbar-controls{justify-content:space-between;border-top:1px solid #ffffff12;padding-top:10px}.select-wrap{flex:1}.select-wrap select{width:100%;min-width:0}.collection-grid,.loading-grid{grid-template-columns:1fr;gap:14px}.collection-image{height:260px}.collection-title{flex-direction:row}.collection-metrics{grid-template-columns:1fr 1fr}.collection-metrics>div{grid-template-columns:1fr;align-items:start}.collection-metrics strong{font-size:12px}.board-foot{flex-direction:column;font-size:8px}.bottom-banner{margin-top:55px;padding:24px 21px}.bottom-banner h2{font-size:29px}.banner-mark{width:58px;height:58px;font-size:35px;border-radius:17px}.market-footer{align-items:start;flex-direction:column}.market-footer>span{line-height:1.5}}
      `}</style>
    </main>
  );
}
