"use client";

import { useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract } from "ethers";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export default function MintPage() {
  const [name, setName] = useState("ROSSA Pixel Explorer #001");
  const [description, setDescription] = useState("A futuristic digital collectible from the X402 OpenSea collection.");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [metadataUri, setMetadataUri] = useState("");
  const [txHash, setTxHash] = useState("");
  const metadata = useMemo(() => ({
    name: name.trim(),
    description: description.trim(),
    image: "ipfs://REPLACE_WITH_UPLOADED_IMAGE_CID",
    attributes: [
      { trait_type: "Collection", value: "X402 Digital Collectibles" },
      { trait_type: "Network", value: "Base" },
      { trait_type: "Edition", value: "001" }
    ]
  }), [name, description]);

  useEffect(() => {
    if (!image) { setPreview(""); return; }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("No EVM wallet detected. Open this page in a browser with a wallet such as Coinbase Wallet or MetaMask.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const chainId = await window.ethereum.request({ method: "eth_chainId" }) as string;
      if (chainId !== "0x2105") {
        setStatus("Wallet connected, but not on Base Mainnet. Switch your wallet to Base (chain ID 8453) before minting.");
      } else {
        setStatus("Wallet connected on Base. Minting still needs an NFT contract and image/metadata uploaded to IPFS.");
      }
      setWallet(accounts?.[0] ?? "");
    } catch {
      setStatus("Wallet connection was cancelled or failed.");
    }
  }

  async function uploadAndMint() {
    if (!image) {
      setStatus("Choose an artwork image first.");
      return;
    }
    if (!name.trim() || !description.trim()) {
      setStatus("Enter an NFT name and description.");
      return;
    }
    if (!window.ethereum) {
      setStatus("No EVM wallet detected. Open this page in a browser with Coinbase Wallet or MetaMask.");
      return;
    }
    const contractAddress = process.env.NEXT_PUBLIC_ROSSA_NFT_CONTRACT;
    if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      setStatus("Minting is not configured yet. Deploy contracts/RossaNFT.sol to Base Mainnet and set NEXT_PUBLIC_ROSSA_NFT_CONTRACT in Vercel.");
      return;
    }
    setUploading(true);
    setTxHash("");
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" }) as string;
      if (chainId !== "0x2105") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }],
        });
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const account = accounts?.[0];
      if (!account) throw new Error("Wallet did not return an account.");

      setStatus("Uploading image and metadata to IPFS…");
      const form = new FormData();
      form.append("image", image);
      form.append("name", name.trim());
      form.append("description", description.trim());
      const uploadResponse = await fetch("/api/nft/upload", { method: "POST", body: form });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadResult.success || !uploadResult.metadataUri) {
        throw new Error(uploadResult.error ?? "IPFS upload failed.");
      }
      setMetadataUri(uploadResult.metadataUri);
      setStatus("Upload complete. Review the mint transaction in your wallet to continue.");

      const provider = new BrowserProvider(window.ethereum as never);
      const signer = await provider.getSigner();
      const contract = new Contract(
        contractAddress,
        ["function mint(address to, string tokenURI_) external returns (uint256 tokenId)"],
        signer
      );
      const tx = await contract.mint(account, uploadResult.metadataUri);
      setTxHash(tx.hash);
      setStatus("Mint transaction sent. Waiting for Base confirmation…");
      await tx.wait();
      setStatus("NFT minted successfully on Base! You can open the transaction in BaseScan.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Mint failed.";
      setStatus(message.includes("user rejected") || message.includes("User rejected")
        ? "Wallet transaction was cancelled."
        : message);
    } finally {
      setUploading(false);
    }
  }

  function downloadMetadata() {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rossa-pixel-explorer-001.metadata.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Metadata JSON downloaded. Upload the image to IPFS first, then replace the image placeholder with its ipfs:// URI.");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0c10", color: "#f4f5f7", fontFamily: "Arial, Helvetica, sans-serif", padding: "28px clamp(16px, 5vw, 56px) 64px" }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <a href="/" style={{ color: "#c4baff", textDecoration: "none", fontWeight: 700 }}>← Back to x402opensea</a>
        <div style={{ marginTop: 30, color: "#a99cff", fontSize: 12, letterSpacing: 2, fontWeight: 800 }}>BASE NFT STUDIO</div>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 56px)", lineHeight: 1.05, letterSpacing: -1.5, margin: "12px 0" }}>Create your first NFT</h1>
        <p style={{ color: "#b4b8c5", maxWidth: 720, lineHeight: 1.7 }}>Prepare the artwork and ERC-721 metadata for ROSSA Pixel Explorer #001. Your wallet stays in your browser; this page never asks for a private key or seed phrase.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 22, marginTop: 28 }}>
          <section style={{ border: "1px solid #292d39", borderRadius: 16, padding: 20, background: "#12141b" }}>
            <h2 style={{ marginTop: 0 }}>1. Artwork and details</h2>
            <label style={{ display: "block", color: "#c6c9d3", fontSize: 14, marginBottom: 8 }}>Artwork (PNG, JPG, GIF, or WEBP)</label>
            <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={(event) => setImage(event.target.files?.[0] ?? null)} style={{ width: "100%", color: "#c6c9d3", marginBottom: 18 }} />
            <div style={{ aspectRatio: "1 / 1", maxWidth: 360, margin: "0 auto 18px", borderRadius: 12, border: "1px dashed #55516f", background: "#0b0c10", display: "grid", placeItems: "center", overflow: "hidden" }}>
              {preview ? <img src={preview} alt="NFT artwork preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ textAlign: "center", padding: 24, color: "#858ba0" }}><div style={{ fontSize: 42 }}>✦</div><div>Choose an image to preview it</div></div>}
            </div>
            <label style={{ display: "block", color: "#c6c9d3", fontSize: 14, marginBottom: 6 }}>NFT name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} style={{ boxSizing: "border-box", width: "100%", padding: 12, borderRadius: 8, border: "1px solid #3a3e4c", background: "#0b0c10", color: "#fff", marginBottom: 14 }} />
            <label style={{ display: "block", color: "#c6c9d3", fontSize: 14, marginBottom: 6 }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={4} style={{ boxSizing: "border-box", width: "100%", padding: 12, borderRadius: 8, border: "1px solid #3a3e4c", background: "#0b0c10", color: "#fff", resize: "vertical" }} />
          </section>

          <section style={{ border: "1px solid #292d39", borderRadius: 16, padding: 20, background: "#12141b" }}>
            <h2 style={{ marginTop: 0 }}>2. Connect wallet</h2>
            <p style={{ color: "#b4b8c5", lineHeight: 1.6 }}>Target network: <strong style={{ color: "#fff" }}>Base Mainnet</strong> (Chain ID 8453). Connecting a wallet does not send a transaction.</p>
            <button onClick={connectWallet} style={{ width: "100%", padding: 13, borderRadius: 9, border: 0, background: "#a99cff", color: "#11121a", fontWeight: 800, cursor: "pointer" }}>{wallet ? "Wallet connected" : "Connect wallet"}</button>
            {wallet && <p style={{ color: "#80e2b2", overflowWrap: "anywhere", fontSize: 13 }}>Connected: {wallet}</p>}
            {status && <p role="status" style={{ color: "#c4baff", lineHeight: 1.6, fontSize: 13 }}>{status}</p>}
            <div style={{ borderTop: "1px solid #292d39", marginTop: 22, paddingTop: 18 }}>
              <h2>3. Metadata preview</h2>
              <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "#0b0c10", color: "#c4baff", borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6 }}>{JSON.stringify(metadata, null, 2)}</pre>
              <button onClick={downloadMetadata} disabled={!name.trim() || !description.trim()} style={{ width: "100%", padding: 13, borderRadius: 9, border: "1px solid #55516f", background: "transparent", color: "#f4f5f7", fontWeight: 700, cursor: "pointer", opacity: !name.trim() || !description.trim() ? 0.5 : 1 }}>Download metadata JSON</button>
            </div>
            <button onClick={uploadAndMint} disabled={uploading || !image || !name.trim() || !description.trim()} style={{ width: "100%", padding: 14, borderRadius: 9, border: 0, background: "#a99cff", color: "#11121a", fontWeight: 800, cursor: "pointer", marginTop: 18, opacity: uploading || !image || !name.trim() || !description.trim() ? 0.55 : 1 }}>{uploading ? "Processing…" : "Upload to IPFS & Mint on Base"}</button>
            {metadataUri && <p style={{ fontSize: 12, lineHeight: 1.6, overflowWrap: "anywhere" }}>Metadata URI: <a href={`https://gateway.pinata.cloud/ipfs/${metadataUri.replace("ipfs://", "")}`} target="_blank" rel="noreferrer" style={{ color: "#c4baff" }}>{metadataUri}</a></p>}
            {txHash && <p style={{ fontSize: 12, lineHeight: 1.6, overflowWrap: "anywhere" }}>Transaction: <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: "#80e2b2" }}>{txHash}</a></p>}
            <div style={{ border: "1px solid #6c5c3a", background: "#211d14", borderRadius: 10, padding: 14, marginTop: 20, color: "#e8d6aa", fontSize: 13, lineHeight: 1.6 }}>
              <strong>Minting setup still required</strong>
              <p style={{ marginBottom: 0 }}>Minting requires a Pinata JWT and a deployed RossaNFT contract on Base. Set PINATA_JWT (server-only) and NEXT_PUBLIC_ROSSA_NFT_CONTRACT in Vercel. Uploading uses IPFS, then your connected wallet will ask you to approve the mint transaction. Never share a private key or seed phrase.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
