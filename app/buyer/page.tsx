"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./buyer.module.css";

type Collection = {
  collection?: string;
  name?: string;
  slug?: string;
  image_url?: string;
  banner_image_url?: string;
  description?: string;
  opensea_url?: string;
  floor_price?: number | string;
  total_volume?: number | string;
  chain?: string;
  contracts?: Array<{ chain?: string }>;
};

type NFT = {
  identifier?: string;
  name?: string;
  description?: string;
  image_url?: string;
  display_image_url?: string;
  opensea_url?: string;
  permalink?: string;
  collection?: string;
  token_id?: string;
  price?: { value?: string; currency?: string };
};

function rowsFrom(payload: unknown, keys: string[]): Record<string, unknown>[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const data = root.data && typeof root.data === "object" ? root.data as Record<string, unknown> : root;
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key] as Record<string, unknown>[];
    if (Array.isArray(root[key])) return root[key] as Record<string, unknown>[];
  }
  return [];
}

function fmt(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 4 }) : String(value);
}

export default function BuyerMarketplace() {
  const [chain, setChain] = useState("ethereum");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selected, setSelected] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadCollections = useCallback(async () => {
    setLoading(true); setError(""); setSelected(null); setNfts([]);
    try {
      const res = await fetch(`/api/opensea/top-collections?chain=${encodeURIComponent(chain)}&limit=12`, { cache: "no-store" });
      const body: unknown = await res.json();
      if (!res.ok) throw new Error((body as { error?: string }).error || `OpenSea API returned HTTP ${res.status}`);
      const list = rowsFrom(body, ["collections", "results", "items"]) as Collection[];
      if (!list.length) throw new Error("Belum ada data koleksi yang bisa ditampilkan. Pastikan OPENSEA_API_KEY dan akses endpoint sudah benar.");
      setCollections(list);
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal memuat koleksi OpenSea."); }
    finally { setLoading(false); }
  }, [chain]);

  useEffect(() => { void loadCollections(); }, [loadCollections]);

  async function openCollection(item: Collection) {
    if (!item.slug) { setError("Slug koleksi tidak tersedia dari API."); return; }
    setSelected(item); setNfts([]); setLoading(true); setError("");
    try {
      const res = await fetch(`/api/opensea/nfts?slug=${encodeURIComponent(item.slug)}&limit=24`, { cache: "no-store" });
      const body: unknown = await res.json();
      if (!res.ok) throw new Error((body as { error?: string }).error || `OpenSea API returned HTTP ${res.status}`);
      setNfts(rowsFrom(body, ["nfts", "assets", "results", "items"]) as NFT[]);
      if (!rowsFrom(body, ["nfts", "assets", "results", "items"]).length) setError("OpenSea tidak mengembalikan NFT untuk koleksi ini.");
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal memuat NFT koleksi."); }
    finally { setLoading(false); }
  }

  const filtered = collections.filter((item) => (item.name || item.collection || item.slug || "").toLowerCase().includes(query.toLowerCase()));
  const collectionUrl = (item: Collection) => item.opensea_url || (item.slug ? `https://opensea.io/collection/${encodeURIComponent(item.slug)}` : "https://opensea.io");

  return <main className={styles.page}>
    <header className={styles.nav}>
      <a href="/" className={styles.brand}><span className={styles.mark}>✳</span> X402<span>SEA</span></a>
      <div className={styles.navRight}><span className={styles.live}><i /> OPEN SEA DATA</span><a href="/api/status">API status ↗</a></div>
    </header>
    <section className={styles.hero}>
      <div><p className={styles.kicker}>BUYER EXPERIENCE / NFT MARKETPLACE</p><h1>Explore NFTs.<br /><em>See the real thing.</em></h1><p className={styles.intro}>A visual marketplace experience powered by OpenSea collection and NFT metadata. Open any collection to inspect available NFTs.</p>
      <div className={styles.heroMeta}><span>LIVE API DATA</span><span>✳</span><span>X402OPENSEA</span></div></div>
      <div className={styles.heroVisual}><div className={styles.glowOrb} /><div className={styles.orbitOne} /><div className={styles.orbitTwo} /><span className={styles.visualTag}>DIGITAL COLLECTIBLES</span><span className={styles.visualFoot}>DISCOVER / COLLECT / EXPLORE</span></div>
    </section>
    <section className={styles.market}>
      <div className={styles.headingRow}><div><p className={styles.kicker}>{selected ? "COLLECTION DETAILS" : "THE MARKET BOARD"}</p><h2>{selected ? (selected.name || selected.collection || selected.slug) : "Trending collections"}<span>.</span></h2><p className={styles.sub}>{selected ? "NFTs returned by the OpenSea API for this collection." : "Select a collection to see its actual NFT artwork and metadata."}</p></div>
      {selected ? <button className={styles.secondary} onClick={() => { setSelected(null); setNfts([]); setError(""); }}>← All collections</button> : <button className={styles.secondary} disabled={loading} onClick={() => void loadCollections()}>{loading ? "Loading…" : "↻ Refresh"}</button>}</div>
      {!selected && <div className={styles.controls}><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search collections…" aria-label="Search collections" /><select value={chain} onChange={(e) => setChain(e.target.value)} aria-label="Blockchain"><option value="ethereum">Ethereum</option><option value="base">Base</option><option value="polygon">Polygon</option><option value="arbitrum">Arbitrum</option><option value="optimism">Optimism</option><option value="solana">Solana</option></select></div>}
      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loading}>Loading verified API data…</div>}
      {!loading && !selected && <div className={styles.grid}>{filtered.map((item, index) => <article className={styles.card} key={item.slug || item.collection || index}>
        <a href={collectionUrl(item)} target="_blank" rel="noreferrer" className={styles.imageLink} title="Open collection on OpenSea">{item.image_url ? <img src={item.image_url} alt={item.name || item.collection || "NFT collection"} loading="lazy" /> : <div className={styles.noImage}>✳<small>IMAGE NOT PROVIDED</small></div>}<span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span></a>
        <div className={styles.cardInfo}><div><h3>{item.name || item.collection || item.slug || "Unnamed collection"}</h3><p>{item.chain || item.contracts?.[0]?.chain || chain}</p></div><div className={styles.floor}><small>FLOOR PRICE</small><strong>{fmt(item.floor_price)}</strong></div></div>
        <button className={styles.cardButton} onClick={() => void openCollection(item)}>Explore NFTs <span>↗</span></button>
      </article>)}</div>}
      {!loading && selected && <div className={styles.nftGrid}>{nfts.map((nft, index) => <article className={styles.nftCard} key={nft.identifier || nft.token_id || index}><div className={styles.nftImage}>{(nft.display_image_url || nft.image_url) ? <img src={nft.display_image_url || nft.image_url} alt={nft.name || "NFT artwork"} loading="lazy" /> : <div className={styles.noImage}>✳<small>IMAGE NOT PROVIDED</small></div>}</div><div className={styles.nftInfo}><h3>{nft.name || `NFT #${nft.identifier || nft.token_id || index + 1}`}</h3><p>Token ID: {nft.identifier || nft.token_id || "—"}</p><a href={nft.opensea_url || nft.permalink || collectionUrl(selected)} target="_blank" rel="noreferrer">View on OpenSea ↗</a></div></article>)}</div>}
      {!loading && !selected && filtered.length === 0 && !error && <p className={styles.empty}>No collections match your search.</p>}
      <p className={styles.disclaimer}>Prices and artwork appear only when supplied by OpenSea. This preview does not execute purchases or wallet transactions.</p>
    </section>
    <footer className={styles.footer}><a href="/" className={styles.brand}><span className={styles.mark}>✳</span> X402<span>SEA</span></a><span>Buyer UI preview · x402 payments remain disabled</span><a href="/api/status">Check API status ↗</a></footer>
  </main>;
}
