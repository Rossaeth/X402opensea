import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "OpenSea API key is not configured on the server." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const chain = (request.nextUrl.searchParams.get("chain") || "base").toLowerCase();
  const limitRaw = Number(request.nextUrl.searchParams.get("limit") || "6");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(20, Math.floor(limitRaw))) : 6;
  const supportedChains = new Set(["ethereum", "base", "polygon", "arbitrum", "optimism", "solana"]);
  if (!supportedChains.has(chain)) {
    return NextResponse.json(
      { success: false, error: "Unsupported chain. Try ethereum, base, polygon, arbitrum, optimism, or solana." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const url = new URL("https://api.opensea.io/api/v2/collections");
    url.searchParams.set("chain", chain);
    url.searchParams.set("limit", String(limit));
    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey, accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!response.ok) {
      const status = response.status;
      return NextResponse.json(
        {
          success: false,
          error: status === 401 ? "OpenSea rejected the API key (401)." :
            status === 403 ? "OpenSea denied access to this endpoint (403)." :
            status === 429 ? "OpenSea rate limit reached (429). Try again later." :
            `OpenSea API returned HTTP ${status}.`,
          upstreamStatus: status,
        },
        { status: status === 429 ? 429 : status === 401 || status === 403 ? 502 : 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = await response.json();
    const collections = Array.isArray(payload.collections) ? payload.collections : [];
    return NextResponse.json(
      {
        success: true,
        source: "OpenSea API v2",
        chain,
        count: collections.length,
        collections: collections.map((collection: Record<string, unknown>) => ({
          name: collection.name ?? collection.collection ?? "Untitled collection",
          slug: collection.collection ?? collection.slug ?? null,
          imageUrl: collection.image_url ?? collection.imageUrl ?? null,
          description: collection.description ?? null,
          openseaUrl: collection.opensea_url ?? (collection.collection ? `https://opensea.io/collection/${collection.collection}` : null),
          chain: collection.chain ?? chain,
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not reach OpenSea API. Check network connectivity and try again." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
