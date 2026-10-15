import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";

export const dynamic = "force-dynamic";

const SUPPORTED_CHAINS = new Set(["ethereum", "base", "polygon", "arbitrum", "optimism", "solana"]);

type Collection = { chain?: string; chains?: string[]; contracts?: Array<{ chain?: string }> };

export async function GET(request: NextRequest) {
  const requestedChain = request.nextUrl.searchParams.get("chain")?.trim().toLowerCase();
  if (requestedChain && !SUPPORTED_CHAINS.has(requestedChain)) {
    return NextResponse.json({ success: false, error: "Unsupported chain.", supportedChains: [...SUPPORTED_CHAINS] }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const upstream = await openSeaGet(request, "/collections/top", ["chain", "sort_by", "limit", "next"]);
  if (!upstream.ok || !requestedChain) return upstream;
  // OpenSea may return mixed-chain collections even when a chain is supplied. Enforce the filter using contract metadata.
  const payload = await upstream.json().catch(() => null);
  if (!payload || typeof payload !== "object") return upstream;
  const root = payload as { data?: { collections?: Collection[]; [key: string]: unknown }; [key: string]: unknown };
  const data = root.data;
  if (!data || !Array.isArray(data.collections)) return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  const filtered = data.collections.filter((collection) => {
    const chains = [
      ...(Array.isArray(collection.chains) ? collection.chains : []),
      ...(Array.isArray(collection.contracts) ? collection.contracts.map((contract) => contract.chain ?? "") : []),
      ...(collection.chain ? [collection.chain] : []),
    ].map((value) => value.toLowerCase());
    return chains.includes(requestedChain);
  });
  return NextResponse.json({ ...root, data: { ...data, collections: filtered, requested_chain: requestedChain, chain_filter_applied: true } }, { headers: { "Cache-Control": "no-store" } });
}
