import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
import { OPENSEA_CHAINS } from "@/lib/opensea";

const TIMEFRAMES = new Set(["1h", "6h", "1d", "7d", "30d"]);

export async function GET(request: NextRequest) {
  const chain = (request.nextUrl.searchParams.get("chain") || "ethereum").toLowerCase();
  const timeframe = (request.nextUrl.searchParams.get("timeframe") || "7d").toLowerCase();
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const limit = rawLimit === null ? 10 : Number(rawLimit);

  if (!OPENSEA_CHAINS.has(chain)) {
    return NextResponse.json({ success: false, error: "Unsupported chain.", supportedChains: Array.from(OPENSEA_CHAINS) }, { status: 400 });
  }
  if (!TIMEFRAMES.has(timeframe)) {
    return NextResponse.json({ success: false, error: "Unsupported timeframe.", supportedTimeframes: Array.from(TIMEFRAMES) }, { status: 400 });
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
    return NextResponse.json({ success: false, error: "limit must be an integer from 1 to 20." }, { status: 400 });
  }

  const url = new URL(request.url);
  url.searchParams.set("chain", chain);
  url.searchParams.set("timeframe", timeframe);
  url.searchParams.set("limit", String(limit));
  return openSeaGet(new NextRequest(url, request), "/collections/trending", ["chain", "timeframe", "limit", "next"]);
}
