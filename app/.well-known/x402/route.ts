import { NextResponse } from "next/server";

export const runtime = "nodejs";
export async function GET() {
  const base = "https://402opensea.vercel.app";
  const resources = [
    { path: "/api/opensea/collections", name: "OpenSea collections", price: "0.01 USD" },
    { path: "/api/opensea/trending", name: "Trending collections", price: "0.02 USD" },
    { path: "/api/opensea/top-collections", name: "Top collections", price: "0.02 USD" },
    { path: "/api/opensea/collection-details", name: "Collection details", price: "0.01 USD", query: "slug" },
    { path: "/api/opensea/collection-stats", name: "Collection stats and floor price", price: "0.02 USD", query: "slug" },
    { path: "/api/opensea/floor-prices", name: "Floor price history", price: "0.02 USD", query: "slug" },
    { path: "/api/opensea/activity", name: "Collection events and sales", price: "0.02 USD", query: "slug" },
    { path: "/api/opensea/listings", name: "Collection listings", price: "0.02 USD", query: "slug" },
    { path: "/api/opensea/offers", name: "Collection offers", price: "0.02 USD", query: "slug" },
    { path: "/api/opensea/wallet-nfts", name: "NFTs owned by a wallet", price: "0.02 USD", query: "address, chain" },
    { path: "/api/opensea/wallet-portfolio", name: "Wallet portfolio analytics", price: "0.03 USD", query: "address" },
    { path: "/api/opensea/wallet-listings", name: "Wallet listings", price: "0.02 USD", query: "address" },
    { path: "/api/opensea/wallet-offers", name: "Wallet offers", price: "0.02 USD", query: "address" },
    { path: "/api/opensea/nft-details", name: "NFT metadata", price: "0.01 USD", query: "chain, contract, token_id" }
  ].map(resource => ({ ...resource, url: base + resource.path, method: "GET", protocol: "x402" }));
  return NextResponse.json({
    version: 1,
    name: "OpenSea x402 Gateway",
    description: "Pay-per-request OpenSea data API for PayBox and AI agents.",
    resources,
    openapi: base + "/openapi.json",
    instructions: "Use the documented query parameters. Make an unpaid request to receive the live x402 v2 payment challenge, then let a compatible client pay and retry. Listed prices are intended gateway prices; the live PAYMENT-REQUIRED challenge is authoritative. NFT buying or listing transactions are not implemented by these read-only endpoints. Arc is not enabled."
  }, { headers: { "Cache-Control": "public, max-age=60" } });
}
