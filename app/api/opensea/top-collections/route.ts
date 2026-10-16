import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";

export const dynamic = "force-dynamic";

const SUPPORTED_CHAINS = new Set(["ethereum", "base", "polygon", "arbitrum", "optimism", "solana"]);

type Collection = {
  chain?: string;
  chains?: string[];
  contracts?: Array<{ chain?: string }>;
};

export async function GET(request: NextRequest) {
  const requestedChain = request.nextUrl.searchParams.get("chain")?.trim().toLowerCase();

  if (requestedChain && !SUPPORTED_CHAINS.has(requestedChain)) {
    return NextResponse.json(
      { success: false, error: "Unsupported chain.", supportedChains: [...SUPPORTED_CHAINS] },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const upstream = await openSeaGet(request, "/collections/top", ["chain", "sort_by", "limit", "next"]);
  if (!upstream.ok || !requestedChain) return upstream;

  const payload = await upstream.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { success: false, error: "Invalid response from OpenSea.", requested_chain: requestedChain },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Our proxy wraps the OpenSea payload as { success, source, data: { collections: [...] } }.
  const root = payload as {
    data?: { collections?: Collection[]; [key: string]: unknown };
    [key: string]: unknown;
  };
  const data = root.data;

  // Fail closed: never return an unfiltered mixed-chain list when the expected shape changes.
  if (!data || !Array.isArray(data.collections)) {
    return NextResponse.json(
      { success: false, error: "Could not safely filter collections by chain.", requested_chain: requestedChain },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  const filtered = data.collections.filter((collection) => {
    const chains = [
      ...(Array.isArray(collection.chains) ? collection.chains : []),
      ...(Array.isArray(collection.contracts) ? collection.contracts.map((contract) => contract.chain ?? "") : []),
      ...(collection.chain ? [collection.chain] : []),
    ].map((value) => value.trim().toLowerCase());

    return chains.includes(requestedChain);
  });

  return NextResponse.json(
    {
      ...root,
      data: {
        ...data,
        collections: filtered,
        requested_chain: requestedChain,
        chain_filter_applied: true,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
